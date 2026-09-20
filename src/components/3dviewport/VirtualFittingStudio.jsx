import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FittedModelCanvas from './FittedModelCanvas';
import {
  findBestMatchingProfile,
  FITTING_PROFILES,
} from './fittingProfiles';
import {
  getDefaultMeasurements,
  calculateBMI,
  calculateRecommendedSize,
} from './measurementConfig';

const FABRIC_COLORS = [
  { id: 'obsidian', name: 'Obsidian Black', hex: '#1e293b' },
  { id: 'navy', name: 'Navy Blue', hex: '#1e3a8a' },
  { id: 'slate', name: 'Heather Grey', hex: '#475569' },
  { id: 'wine', name: 'Crimson Wine', hex: '#881337' },
  { id: 'ivory', name: 'Stone White', hex: '#e2e8f0' },
  { id: 'forest', name: 'Emerald Pine', hex: '#064e3b' },
];

const VirtualFittingStudio = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve user measurements passed from 3D Viewport or localStorage
  const measurements = useMemo(() => {
    if (location.state && location.state.measurements) {
      return location.state.measurements;
    }
    try {
      const saved = localStorage.getItem('saved_body_measurements');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved measurements', e);
    }
    return getDefaultMeasurements();
  }, [location.state]);

  // Global Studio Camera & Display State
  const [cameraView, setCameraView] = useState('front');
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [selectedFabricColor, setSelectedFabricColor] = useState(FABRIC_COLORS[0]);

  // Best matched profile computed from shape keys
  const matchResult = useMemo(() => {
    return findBestMatchingProfile(measurements);
  }, [measurements]);

  // Allow user to manually test different body profiles if desired
  const [selectedProfileId, setSelectedProfileId] = useState(matchResult.profile.id);

  // Active profile being visualized
  const activeProfile = useMemo(() => {
    return FITTING_PROFILES.find((p) => p.id === selectedProfileId) || matchResult.profile;
  }, [selectedProfileId, matchResult.profile]);

  // User selected garment size
  const [chosenSize, setChosenSize] = useState('M');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectSize = (sizeKey) => {
    setChosenSize(sizeKey);
    showToast(`Selected Size ${sizeKey} for your virtual fitting profile!`);
  };

  // BMI & Recommended Size calculation
  const bmiInfo = useMemo(() => {
    const waist = measurements.belly ?? 80;
    const estWeight = Math.round(50 + ((waist - 60) / 65) * 65);
    return calculateBMI(estWeight);
  }, [measurements.belly]);

  const recommendedSize = useMemo(() => {
    return calculateRecommendedSize(measurements.chest, measurements.belly);
  }, [measurements.chest, measurements.belly]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white pt-20 lg:pt-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md bg-emerald-950/95 border border-emerald-500 text-emerald-200 text-sm font-semibold animate-fade-in">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Sub-Header & Studio Controls ── */}
      <div className="border-b border-slate-800/90 bg-slate-900/70 backdrop-blur-xl px-4 lg:px-8 py-3.5 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Back Link & Title */}
          <div className="flex items-center gap-3.5">
            <Link
              to="/3d-viewport"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>← Adjust Body Sliders</span>
            </Link>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <h1 className="text-sm md:text-base font-bold tracking-wider uppercase text-white font-['Outfit']">
                  Virtual Fitting Room • Garment Size Comparison
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Side-by-side Small, Medium & Large fit comparison rendered directly on your anatomical profile
              </p>
            </div>
          </div>

          {/* Right: Matched Profile Pill & Re-calibrate CTA */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Matched Profile Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-950/80 border border-sky-800/80 text-sky-300 text-xs">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="font-semibold">{activeProfile.tag}: {activeProfile.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-200">
                {matchResult.confidence}% Anatomical Match
              </span>
            </div>

            {/* BMI Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400">BMI</span>
              <span className={`font-semibold ${bmiInfo.color}`}>{bmiInfo.bmi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Secondary Controls: Camera Angles, 360 Turntable & Fabric Color ── */}
      <div className="border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md px-4 lg:px-8 py-2.5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Synchronized Camera Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:block">
              Camera:
            </span>
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {['front', 'side', 'back', 'perspective'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCameraView(view)}
                  className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                    cameraView === view
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {view === 'perspective' ? '3/4 View' : view}
                </button>
              ))}
            </div>

            {/* Turntable 360° */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border backdrop-blur-md transition-all flex items-center gap-1.5 ${
                isAutoRotating
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span className={isAutoRotating ? 'animate-spin inline-block' : ''}>↻</span>
              <span>{isAutoRotating ? 'Rotating' : '360° Spin'}</span>
            </button>
          </div>

          {/* Fabric Color Swatches */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:block">
              Fabric Color:
            </span>
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              {FABRIC_COLORS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedFabricColor(col)}
                  title={col.name}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    selectedFabricColor.id === col.id
                      ? 'scale-125 ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900'
                      : 'hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-slate-300 hidden md:block">
              {selectedFabricColor.name}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Comparison Grid: 3 Interactive 3D Model Viewports (S, M, L) ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[560px]">
          {/* ── CARD 1: SMALL (S) ── */}
          <div
            className={`flex flex-col rounded-3xl p-4 transition-all border ${
              chosenSize === 'S'
                ? 'bg-slate-900/90 border-sky-500 shadow-2xl shadow-sky-500/10 ring-1 ring-sky-500/50'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                    S
                  </span>
                  <h2 className="text-base font-bold text-white font-['Outfit']">Small</h2>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Fitted / Athletic Drape</p>
              </div>

              {activeProfile.files.small ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Snug Fit
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800">
                  Not Available
                </span>
              )}
            </div>

            {/* 3D Canvas Viewport */}
            <div className="flex-1 min-h-[380px] w-full relative">
              <FittedModelCanvas
                modelUrl={activeProfile.files.small}
                sizeLabel="Small (S)"
                cameraView={cameraView}
                isAutoRotating={isAutoRotating}
                shirtColor={selectedFabricColor.hex}
              />
            </div>

            {/* Fit Assessment Card & Selection Button */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
              <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                {activeProfile.files.small
                  ? 'Closer fit around the upper chest and torso. Snug around the arms for an athletic appearance.'
                  : 'Your body proportions exceed Small specifications. Trying Small would cause tension across chest & shoulders.'}
              </p>

              <button
                disabled={!activeProfile.files.small}
                onClick={() => handleSelectSize('S')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  !activeProfile.files.small
                    ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                    : chosenSize === 'S'
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {!activeProfile.files.small
                  ? 'Size S Unavailable'
                  : chosenSize === 'S'
                  ? '✓ Selected (Small)'
                  : 'Choose Small (S)'}
              </button>
            </div>
          </div>

          {/* ── CARD 2: MEDIUM (M) ── */}
          <div
            className={`flex flex-col rounded-3xl p-4 transition-all border relative ${
              chosenSize === 'M'
                ? 'bg-slate-900/90 border-sky-500 shadow-2xl shadow-sky-500/10 ring-1 ring-sky-500/50'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Recommended Ribbon */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
              <span>★</span>
              <span>Recommended Fit</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1 mt-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-xs font-bold text-sky-400">
                    M
                  </span>
                  <h2 className="text-base font-bold text-white font-['Outfit']">Medium</h2>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Regular / Tailored Fit</p>
              </div>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800">
                Optimal Drape
              </span>
            </div>

            {/* 3D Canvas Viewport */}
            <div className="flex-1 min-h-[380px] w-full relative">
              <FittedModelCanvas
                modelUrl={activeProfile.files.medium}
                sizeLabel="Medium (M)"
                cameraView={cameraView}
                isAutoRotating={isAutoRotating}
                shirtColor={selectedFabricColor.hex}
              />
            </div>

            {/* Fit Assessment Card & Selection Button */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
              <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                Balanced anatomical drape with clean shoulder line. Delivers all-day comfort with natural movement and no pull.
              </p>

              <button
                onClick={() => handleSelectSize('M')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  chosenSize === 'M'
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {chosenSize === 'M' ? '✓ Selected (Medium)' : 'Choose Medium (M)'}
              </button>
            </div>
          </div>

          {/* ── CARD 3: LARGE (L) ── */}
          <div
            className={`flex flex-col rounded-3xl p-4 transition-all border ${
              chosenSize === 'L'
                ? 'bg-slate-900/90 border-sky-500 shadow-2xl shadow-sky-500/10 ring-1 ring-sky-500/50'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                    L
                  </span>
                  <h2 className="text-base font-bold text-white font-['Outfit']">Large</h2>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Relaxed / Streetwear Fit</p>
              </div>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Comfort Drape
              </span>
            </div>

            {/* 3D Canvas Viewport */}
            <div className="flex-1 min-h-[380px] w-full relative">
              <FittedModelCanvas
                modelUrl={activeProfile.files.large}
                sizeLabel="Large (L)"
                cameraView={cameraView}
                isAutoRotating={isAutoRotating}
                shirtColor={selectedFabricColor.hex}
              />
            </div>

            {/* Fit Assessment Card & Selection Button */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
              <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                Relaxed drape with extra chest and sleeve ease. Ideal for oversized streetwear styling and casual layering.
              </p>

              <button
                onClick={() => handleSelectSize('L')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  chosenSize === 'L'
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {chosenSize === 'L' ? '✓ Selected (Large)' : 'Choose Large (L)'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom Action Footer ── */}
        <div className="mt-8 p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {chosenSize}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Confirmed Size: {chosenSize === 'S' ? 'Small' : chosenSize === 'M' ? 'Medium' : 'Large'}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Ready for Checkout
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Calibrated to your {measurements.chest} cm chest & {measurements.belly} cm waist.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/3d-viewport"
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Re-calibrate Measurements
            </Link>

            <Link
              to="/shop"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2"
            >
              <span>Explore Clothes in Size {chosenSize}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirtualFittingStudio;
