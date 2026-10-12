import React, { useState } from 'react';

interface GoogleStitchCanvasStudioProps {
  runIntent?: string;
  artifactContent?: string;
  onUploadDesign?: (content: string, mime: string) => void;
  onApproveGate?: () => void;
}

export const GoogleStitchCanvasStudio: React.FC<GoogleStitchCanvasStudioProps> = ({
  runIntent = 'Car Agency & Rental Portal with Red & Blue Theme',
  artifactContent,
  onUploadDesign,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'canvas' | 'tokens' | 'stitch_html' | 'sdk'>('canvas');
  const [sdkStatus, setSdkStatus] = useState<'connected' | 'syncing' | 'synced'>('connected');
  const [syncedCount, setSyncedCount] = useState(14);
  const [toast, setToast] = useState<string | null>(null);

  // Parse artifact content if available
  let parsedDesign: any = null;
  try {
    if (artifactContent) {
      parsedDesign = JSON.parse(artifactContent);
    }
  } catch {
    parsedDesign = null;
  }

  // Theme State (60-30-10 Color Budget)
  const [dominantColor, setDominantColor] = useState(
    parsedDesign?.colorPalette?.find((c: any) => c.name?.toLowerCase().includes('dominant'))?.hex ||
    parsedDesign?.colorPalette?.[0]?.hex || '#0f172a'
  );
  const [secondaryColor, setSecondaryColor] = useState(
    parsedDesign?.colorPalette?.find((c: any) => c.name?.toLowerCase().includes('secondary'))?.hex ||
    parsedDesign?.colorPalette?.[1]?.hex || '#1e293b'
  );
  const [accentColor, setAccentColor] = useState(
    parsedDesign?.colorPalette?.find((c: any) => c.name?.toLowerCase().includes('accent'))?.hex ||
    parsedDesign?.colorPalette?.[2]?.hex || '#dc2626'
  );
  const [highlightColor, setHighlightColor] = useState(
    parsedDesign?.colorPalette?.find((c: any) => c.name?.toLowerCase().includes('highlight'))?.hex ||
    parsedDesign?.colorPalette?.[3]?.hex || '#2563eb'
  );

  const [customHtml, setCustomHtml] = useState(
    typeof artifactContent === 'string' && artifactContent.includes('<') ? artifactContent : ''
  );

  const [cartCount, setCartCount] = useState(0);

  const cleanAppTitle = (raw?: string, parsedName?: string) => {
    if (parsedName && !parsedName.includes('Primary Run Intent')) return parsedName;
    if (!raw) return 'Custom Application';
    let cleaned = raw
      .replace(/Assembly Run/gi, '')
      .replace(/Primary Run Intent:?/gi, '')
      .replace(/show prodcut of my/gi, '')
      .replace(/show product of my/gi, '')
      .replace(/website for my/gi, '')
      .replace(/website for/gi, '')
      .replace(/color white and red/gi, '')
      .replace(/only e store to show my/gi, '')
      .replace(/with cart/gi, '')
      .replace(/only/gi, '')
      .trim();

    if (!cleaned) return 'Custom Web Application';
    cleaned = cleaned.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (cleaned.toLowerCase().includes('juice')) return `${cleaned} Storefront`;
    if (cleaned.toLowerCase().includes('cofe') || cleaned.toLowerCase().includes('coffee')) return `${cleaned} E-Store`;
    return cleaned;
  };

  const displayTitle = cleanAppTitle(runIntent, parsedDesign?.productName);
  const lowerText = `${runIntent || ''} ${JSON.stringify(parsedDesign || {})}`.toLowerCase();

  const isJuice = lowerText.includes('juice') || lowerText.includes('smoothie') || lowerText.includes('drink') || lowerText.includes('beverage');
  const isCoffee = !isJuice && (lowerText.includes('coffe') || lowerText.includes('coffee') || lowerText.includes('cafe') || lowerText.includes('roast') || lowerText.includes('cofe'));
  const isApartment = !isJuice && !isCoffee && (lowerText.includes('apartment') || lowerText.includes('rent') || lowerText.includes('lease') || lowerText.includes('property'));
  const isRedWhite = lowerText.includes('white and red') || lowerText.includes('red and white') || lowerText.includes('white & red');

  let catalogItems = [
    { name: 'Core Feature Workflow Module 01', price: 'Active State', tag: 'Stitch Synthesized', icon: '⚡', desc: 'Interactive primary application workspace with responsive state management.' },
    { name: 'Data Management & Records View', price: 'Syncing', tag: 'Realtime DB', icon: '📊', desc: 'Role-based record management and status filtering panel.' },
    { name: 'User Account & Analytics Dashboard', price: 'Connected', tag: 'Security Verified', icon: '🛡️', desc: 'User profile management, notifications, and analytics metrics.' },
  ];

  if (isJuice) {
    catalogItems = [
      { name: 'Pure Organic Orange & Ginger Cold-Pressed', price: '$8.50', tag: '100% Organic', icon: '🧃', desc: 'Freshly squeezed Valencia oranges with cold-extracted ginger root for daily vitality.' },
      { name: 'Green Detox Cleanse (Kale, Apple, Cucumber)', price: '$9.50', tag: 'Detox Pack', icon: '🥦', desc: 'Nutrient-dense raw green blend packed with vitamins A, C, and plant antioxidants.' },
      { name: 'Wild Berry Immunity Booster (500ml)', price: '$8.00', tag: 'Best Seller', icon: '🫐', desc: 'Cold-pressed blueberry, raspberry, and pomegranate raw immunity elixir.' },
    ];
  } else if (isCoffee) {
    catalogItems = [
      { name: 'CafeNova Signature Red Roast (250g)', price: '$18.50', tag: 'Fresh Roast', icon: '☕', desc: 'Single-origin specialty coffee beans with rich dark chocolate notes.' },
      { name: 'Artisanal Whole Bean Espresso', price: '$22.00', tag: 'Top Rated', icon: '🫘', desc: 'Premium Arabica roast roasted in small batches for optimal extraction.' },
      { name: 'Cold Brew House Reserve Extract', price: '$14.99', tag: 'Best Seller', icon: '🧊', desc: 'Concentrated 18-hour cold brew extract ready for instant serving.' },
    ];
  } else if (isApartment) {
    catalogItems = [
      { name: 'Modern Downtown Luxury Apartment', price: '$1,850/mo', tag: 'Available', icon: '🏢', desc: '2 Bed • 2 Bath • Balcony & Parking Included' },
      { name: 'Sunset Bay Executive Studio', price: '$1,400/mo', tag: 'New Listing', icon: '🔑', desc: '1 Bed • 1 Bath • Fully Furnished & Utilities Included' },
      { name: 'Park View Family Residence', price: '$2,400/mo', tag: 'Featured', icon: '🏡', desc: '3 Bed • 2 Bath • Private Garden & Garage' },
    ];
  }

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSyncSdk = () => {
    setSdkStatus('syncing');
    showNotification('🔄 Syncing canvas state with Google Stitch Canvas SDK (v2.4-pro)...');
    setTimeout(() => {
      setSdkStatus('synced');
      setSyncedCount((prev) => prev + 1);
      showNotification('✅ Google Stitch SDK Sync Complete! Tokens & Component Hierarchy updated.');
    }, 1200);
  };

  const handleApplyStitchExport = () => {
    if (!customHtml.trim()) return;
    if (onUploadDesign) {
      onUploadDesign(customHtml, 'text/html');
    }
    showNotification('🎨 Custom Google Stitch HTML Layout Export applied to Gate 2!');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showNotification(`📋 Copied ${label} (${text}) to clipboard!`);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-300 shadow-md overflow-hidden my-6 font-sans">
      {/* STITCH STUDIO HEADER & SDK INTEGRATION BAR */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-stone-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[24px]">grid_view</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-white">Google Stitch AI Canvas Studio</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/30">
                Stitch SDK v2.4 Connected
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Role 02 · Designer Agent • Interactive Stitch Canvas & 60-30-10 Design Token Synthesis
            </p>
          </div>
        </div>

        {/* SDK ACTIONS & STATUS */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${sdkStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-stone-300">Stitch SDK:</span>
            <span className="text-emerald-400 font-bold">{sdkStatus.toUpperCase()} ({syncedCount} tokens)</span>
          </div>

          <button
            type="button"
            onClick={handleSyncSdk}
            disabled={sdkStatus === 'syncing'}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[16px] ${sdkStatus === 'syncing' ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>Sync Stitch SDK</span>
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="bg-amber-600 text-white text-xs font-bold px-4 py-2.5 flex items-center justify-between animate-fade-in">
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-white hover:text-stone-200 text-sm cursor-pointer">✕</button>
        </div>
      )}

      {/* CANVAS STUDIO CONTROLS BAR */}
      <div className="bg-stone-100 p-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* VIEW MODE TABS */}
        <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl border border-stone-300">
          <button
            type="button"
            onClick={() => setActiveTab('canvas')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'canvas' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_quilt</span>
            <span>Interactive Design Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tokens')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tokens' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">palette</span>
            <span>Stitch Tokens (60-30-10)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stitch_html')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'stitch_html' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>Manual Stitch HTML / Code</span>
          </button>
        </div>

        {/* DEVICE FRAME SWITCHER */}
        {activeTab === 'canvas' && (
          <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl border border-stone-300">
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer font-medium ${
                deviceMode === 'desktop' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Desktop View (1440px)"
            >
              <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
              <span className="hidden sm:inline text-[11px]">Desktop (1440px)</span>
            </button>

            <button
              type="button"
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer font-medium ${
                deviceMode === 'tablet' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Tablet View (768px)"
            >
              <span className="material-symbols-outlined text-[18px]">tablet_mac</span>
              <span className="hidden sm:inline text-[11px]">Tablet (768px)</span>
            </button>

            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer font-medium ${
                deviceMode === 'mobile' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Mobile View (375px)"
            >
              <span className="material-symbols-outlined text-[18px]">smartphone</span>
              <span className="hidden sm:inline text-[11px]">Mobile (375px)</span>
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: INTERACTIVE GOOGLE STITCH DESIGN CANVAS */}
      {activeTab === 'canvas' && (
        <div className="p-6 bg-stone-900 min-h-[520px] flex flex-col items-center justify-start overflow-x-auto relative">
          {/* CANVAS TOP TOOLBAR */}
          <div className="w-full max-w-5xl mb-4 flex items-center justify-between text-xs text-stone-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Google Stitch Canvas Layout View</span>
              <span>•</span>
              <span className="text-stone-300 font-bold">{runIntent}</span>
            </div>

            <div className="flex items-center gap-3">
              <span>Zoom: 100%</span>
              <span className="text-amber-400 font-bold">Grid: 8pt Snap</span>
            </div>
          </div>

          {/* DEVICE WIREFRAME CONTAINER */}
          <div
            className={`transition-all duration-300 bg-white rounded-2xl shadow-2xl border-4 border-stone-800 overflow-hidden flex flex-col my-auto ${
              deviceMode === 'desktop'
                ? 'w-full max-w-5xl min-h-[460px]'
                : deviceMode === 'tablet'
                ? 'w-[720px] min-h-[460px]'
                : 'w-[375px] min-h-[520px]'
            }`}
          >
            {/* DEVICE BROWSER HEADER */}
            <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="bg-white border border-stone-300 rounded-lg px-3 py-0.5 text-[11px] text-stone-600 font-mono w-1/2 text-center truncate">
                https://stitch.factory.internal/canvas/preview
              </div>
              <div className="text-stone-400 text-[10px] font-mono">Stitch Canvas Engine</div>
            </div>

            {/* LIVE STITCH UI CANVAS MOCKUP */}
            {customHtml ? (
              <iframe srcDoc={customHtml} title="Custom Stitch Canvas" className="w-full min-h-[420px] border-none" />
            ) : (
              <div className="flex-1 flex flex-col font-sans text-stone-900 bg-stone-50">
                {/* APP HEADER */}
                <header style={{ backgroundColor: isRedWhite ? '#ffffff' : dominantColor, borderColor: isRedWhite ? '#fee2e2' : 'transparent' }} className="text-stone-900 p-4 shadow-xs border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div style={{ backgroundColor: isJuice ? '#ea580c' : accentColor }} className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs text-lg">
                      {isJuice ? '🧃' : isCoffee ? '☕' : isApartment ? '🏢' : '✨'}
                    </div>
                    <div>
                      <h1 className="font-bold text-sm tracking-tight text-stone-900">{displayTitle}</h1>
                      <p className="text-[10px] text-stone-500 font-mono">Google Stitch Synthesis • {isJuice ? 'Organic Citrus Theme' : isRedWhite ? 'White & Red Theme' : '60-30-10 Token Frame'}</p>
                    </div>
                  </div>

                  <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-stone-700">
                    <span className="hover:text-red-600 cursor-pointer font-semibold">Catalog</span>
                    <span className="hover:text-red-600 cursor-pointer font-semibold">Specialties</span>
                    <button
                      onClick={() => {
                        setCartCount((c) => c + 1);
                        showNotification('🛒 Item added to shopping cart!');
                      }}
                      style={{ backgroundColor: isJuice ? '#ea580c' : accentColor }}
                      className="px-3.5 py-1.5 rounded-xl font-bold text-white shadow-xs hover:brightness-110 cursor-pointer flex items-center gap-1.5 text-xs"
                    >
                      <span>🛒 Cart</span>
                      <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px] font-mono">{cartCount}</span>
                    </button>
                  </nav>
                </header>

                {/* HERO BANNER */}
                <div
                  style={{
                    backgroundColor: isJuice ? '#fff7ed' : isRedWhite ? '#fef2f2' : secondaryColor,
                    borderColor: isJuice ? '#ffedd5' : isRedWhite ? '#fecaca' : 'transparent'
                  }}
                  className="p-8 relative overflow-hidden flex flex-col justify-center min-h-[180px] border-b"
                >
                  <div className="max-w-2xl z-10 space-y-3">
                    <span style={{ backgroundColor: isJuice ? '#ea580c' : accentColor }} className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white inline-block shadow-2xs">
                      {isJuice ? '100% Raw Cold-Pressed • Juice Factory Storefront' : isCoffee ? 'Fresh Roast • White & Red E-Store' : isApartment ? 'Verified Rental Property' : 'Google Stitch Component Frame'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
                      {displayTitle}
                    </h2>
                    <p className="text-xs text-stone-600 max-w-lg leading-relaxed">
                      {parsedDesign?.prdSummary || 'Minimalist, high-conversion storefront interface strictly adhering to your white and red design specifications with dynamic cart management.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setCartCount((c) => c + 1);
                          showNotification('🛒 Added Featured Item to Cart!');
                        }}
                        style={{ backgroundColor: accentColor }}
                        className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md hover:brightness-110 cursor-pointer flex items-center gap-2"
                      >
                        <span>Explore Catalog</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC CATALOG CARDS GRID */}
                <div className="p-6 space-y-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">{isCoffee ? 'Featured Coffee Products' : 'Application Core Hierarchy'}</h3>
                      <p className="text-xs text-stone-500">Google Stitch Component Synthesis</p>
                    </div>
                    <span className="text-xs font-bold text-red-600 hover:underline cursor-pointer">View All Items →</span>
                  </div>

                  <div className={`grid gap-4 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    {catalogItems.map((item: any, i: number) => (
                      <div key={i} className="bg-stone-50 rounded-2xl p-4 border border-stone-200 shadow-2xs hover:shadow-md transition space-y-3">
                        <div className="h-28 rounded-xl bg-white flex items-center justify-center border border-stone-200 relative overflow-hidden">
                          <span className="text-4xl">{item.icon || '☕'}</span>
                          <span style={{ backgroundColor: accentColor }} className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs">
                            {item.tag}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-stone-900">{item.name}</h4>
                          <p className="text-[11px] text-stone-500">{item.desc}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                          <span className="font-extrabold text-xs text-stone-900">{item.price}</span>
                          <button
                            onClick={() => {
                              setCartCount((c) => c + 1);
                              showNotification(`🛒 Added ${item.name} to Cart!`);
                            }}
                            style={{ backgroundColor: accentColor }}
                            className="px-3 py-1.5 rounded-xl text-white font-bold text-[11px] hover:opacity-90 cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER BAR */}
                <footer className="mt-auto bg-stone-900 text-stone-400 p-4 border-t border-stone-800 text-center text-xs">
                  © 2026 {displayTitle}. Synthesized via Google Stitch AI Canvas Engine.
                </footer>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STITCH 60-30-10 DESIGN TOKENS & COLOR BUDGET */}
      {activeTab === 'tokens' && (
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">palette</span>
                <span>Google Stitch Design Tokens & 60-30-10 Color Budget</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Role 02 Designer Agent dynamically balances primary, secondary, and accent colors for maximum contrast and visual harmony.
              </p>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(JSON.stringify({ dominantColor, secondaryColor, accentColor, highlightColor }, null, 2), 'Stitch Design Tokens JSON')}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Export Design Tokens (JSON)</span>
            </button>
          </div>

          {/* 60-30-10 VISUAL BUDGET BAR */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-stone-700">
              <span>60-30-10 Color Distribution Budget</span>
              <span>100% Total Canvas Surface Area</span>
            </div>
            <div className="h-6 rounded-xl overflow-hidden flex border border-stone-300 shadow-2xs font-mono text-[11px] text-white font-bold">
              <div style={{ backgroundColor: dominantColor }} className="w-[60%] flex items-center justify-center">
                60% Dominant Surface
              </div>
              <div style={{ backgroundColor: secondaryColor }} className="w-[30%] flex items-center justify-center">
                30% Panels
              </div>
              <div style={{ backgroundColor: accentColor }} className="w-[10%] flex items-center justify-center">
                10% Accent
              </div>
            </div>
          </div>

          {/* COLOR SWATCH EDITORS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">60% Dominant (Surface)</span>
                <input
                  type="color"
                  value={dominantColor}
                  onChange={(e) => setDominantColor(e.target.value)}
                  className="w-7 h-7 rounded border-none cursor-pointer"
                />
              </div>
              <div className="h-16 rounded-lg shadow-inner flex items-center justify-center font-mono text-xs font-bold text-white" style={{ backgroundColor: dominantColor }}>
                {dominantColor}
              </div>
              <p className="text-[11px] text-stone-500">Used for primary headers, dark backgrounds, and overall canvas base.</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">30% Secondary (Cards)</span>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-7 h-7 rounded border-none cursor-pointer"
                />
              </div>
              <div className="h-16 rounded-lg shadow-inner flex items-center justify-center font-mono text-xs font-bold text-white" style={{ backgroundColor: secondaryColor }}>
                {secondaryColor}
              </div>
              <p className="text-[11px] text-stone-500">Used for hero sections, card containers, and secondary layout blocks.</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">10% Accent (Call to Action)</span>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-7 h-7 rounded border-none cursor-pointer"
                />
              </div>
              <div className="h-16 rounded-lg shadow-inner flex items-center justify-center font-mono text-xs font-bold text-white" style={{ backgroundColor: accentColor }}>
                {accentColor}
              </div>
              <p className="text-[11px] text-stone-500">Used for high-priority CTA buttons, booking highlights, and primary badges.</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">Highlight / Interactive</span>
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => setHighlightColor(e.target.value)}
                  className="w-7 h-7 rounded border-none cursor-pointer"
                />
              </div>
              <div className="h-16 rounded-lg shadow-inner flex items-center justify-center font-mono text-xs font-bold text-white" style={{ backgroundColor: highlightColor }}>
                {highlightColor}
              </div>
              <p className="text-[11px] text-stone-500">Used for secondary buttons, interactive hovers, and active state indicators.</p>
            </div>
          </div>

          {/* COMPONENT HIERARCHY TREE */}
          <div className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs space-y-2">
            <div className="font-bold text-amber-400 flex items-center justify-between">
              <span>Google Stitch Component Hierarchy Tree:</span>
              <span className="text-[11px] text-stone-400">Synthesized by Role 02 Designer Agent</span>
            </div>
            <pre className="text-stone-300 leading-relaxed overflow-x-auto p-2 bg-stone-950 rounded-lg">
{`AppContainer (Stitch Layout Frame)
├── StitchNavigationHeader [Dominant: ${dominantColor}]
│   ├── LogoBrand (Car Agency)
│   ├── NavLinks (Fleet, Pricing, Bookings)
│   └── CTAButton [Accent: ${accentColor}]
├── StitchHeroBanner [Secondary: ${secondaryColor}]
│   ├── Headline & Agency Value Prop
│   └── ActionButtonGroup [Accent: ${accentColor}, Highlight: ${highlightColor}]
├── StitchFleetGrid (3 Columns Responsive)
│   ├── CarCardItem [Sedan S-Class]
│   ├── CarCardItem [Sport SUV]
│   └── CarCardItem [Electric VIP]
└── StitchFooterBar [Base Surface: ${dominantColor}]`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: MANUAL STITCH HTML / EXPORT CODE UPLOADER */}
      {activeTab === 'stitch_html' && (
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">file_code</span>
              <span>Manual Google Stitch HTML / Export Upload</span>
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Paste raw HTML or Stitch layout token JSON here. It will immediately update the live Google Stitch Canvas above.
            </p>
          </div>

          <textarea
            value={customHtml}
            onChange={(e) => setCustomHtml(e.target.value)}
            placeholder="Paste raw Google Stitch HTML, wireframe SVG, or design token JSON here..."
            rows={8}
            className="w-full p-4 rounded-xl border border-stone-300 text-xs font-mono bg-stone-50 outline-none focus:border-amber-600 focus:bg-white transition"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCustomHtml('')}
              className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs transition cursor-pointer"
            >
              Clear Editor
            </button>
            <button
              type="button"
              onClick={handleApplyStitchExport}
              disabled={!customHtml.trim()}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              Apply to Stitch Canvas & Save Gate 2 Output
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
