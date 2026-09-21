import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BodyModelCanvas from './BodyModelCanvas';
import {
  MEASUREMENT_FIELDS,
  getDefaultMeasurements,
  toDisplayValue,
  toMetricValue,
  calculateRecommendedSize,
} from './measurementConfig';

const BodyViewport = () => {
  const canvasRef = useRef(null);

  // Unit system: 'metric' (cm, kg) or 'imperial' (in, lbs)
  const [unitSystem, setUnitSystem] = useState('metric');

  // Measurements stored internally as Metric numbers
  const [measurements, setMeasurements] = useState(() => {
    try {
      const saved = localStorage.getItem('saved_body_measurements');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved measurements', e);
    }
    return getDefaultMeasurements();
  });

  // Local input string state for type boxes to allow natural typing without cursor jumping
  const [typeBoxValues, setTypeBoxValues] = useState({});

  // Active category filter: 'all' | 'vital' | 'torso' | 'upper'
  const [activeTab, setActiveTab] = useState('all');

  // Studio Display Settings
  const [showWireframe, setShowWireframe] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [cameraView, setCameraView] = useState('front');

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Sync typeBox local string state whenever measurements or unitSystem change
  useEffect(() => {
    const newTypeBoxVals = {};
    MEASUREMENT_FIELDS.forEach((field) => {
      const currentMetricVal = measurements[field.key] ?? field.metric.default;
      newTypeBoxVals[field.key] = toDisplayValue(field.key, currentMetricVal, unitSystem).toString();
    });
    setTypeBoxValues(newTypeBoxVals);
  }, [measurements, unitSystem]);

  // Show auto-dismissing toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Slider change handler
  const handleSliderChange = (key, rawDisplayVal) => {
    const num = parseFloat(rawDisplayVal);
    if (isNaN(num)) return;

    // Convert display value back to metric for internal state
    const metricVal = toMetricValue(key, num, unitSystem);
    setMeasurements((prev) => ({
      ...prev,
      [key]: metricVal,
    }));
    setTypeBoxValues((prev) => ({
      ...prev,
      [key]: num.toString(),
    }));
  };

  // Type box typing handler (instant update if valid, or tracks input text)
  const handleTypeBoxChange = (key, text) => {
    setTypeBoxValues((prev) => ({
      ...prev,
      [key]: text,
    }));

    const num = parseFloat(text);
    if (!isNaN(num)) {
      const metricVal = toMetricValue(key, num, unitSystem);
      const fieldConfig = MEASUREMENT_FIELDS.find((f) => f.key === key);
      const bounds = unitSystem === 'metric' ? fieldConfig.metric : fieldConfig.imperial;

      // Allow typing but clamp to reasonable envelope
      if (num >= bounds.min * 0.8 && num <= bounds.max * 1.3) {
        setMeasurements((prev) => ({
          ...prev,
          [key]: metricVal,
        }));
      }
    }
  };

  // Type box onBlur: snap to clamped valid range
  const handleTypeBoxBlur = (key) => {
    const fieldConfig = MEASUREMENT_FIELDS.find((f) => f.key === key);
    const bounds = unitSystem === 'metric' ? fieldConfig.metric : fieldConfig.imperial;
    let num = parseFloat(typeBoxValues[key]);

    if (isNaN(num)) {
      num = bounds.default;
    } else {
      num = Math.max(bounds.min, Math.min(bounds.max, num));
    }

    const metricVal = toMetricValue(key, num, unitSystem);
    setMeasurements((prev) => ({
      ...prev,
      [key]: metricVal,
    }));
    setTypeBoxValues((prev) => ({
      ...prev,
      [key]: num.toString(),
    }));
  };

  // Reset a single measurement
  const handleResetSingle = (key) => {
    const field = MEASUREMENT_FIELDS.find((f) => f.key === key);
    if (!field) return;
    setMeasurements((prev) => ({
      ...prev,
      [key]: field.metric.default,
    }));
    showToast(`Reset ${field.label} to default`, 'info');
  };

  // Apply a body preset
  const handleApplyPreset = (preset) => {
    setMeasurements((prev) => ({
      ...prev,
      ...preset.values,
    }));
    showToast(`Applied "${preset.name}" preset`, 'info');
  };

  // Reset all to defaults
  const handleResetAll = () => {
    setMeasurements(getDefaultMeasurements());
    showToast('Reset all measurements to standard defaults', 'info');
  };

  // Save measurements to localStorage
  const handleSaveProfile = () => {
    try {
      localStorage.setItem('saved_body_measurements', JSON.stringify(measurements));
      showToast('Measurements saved! Your size profile is stored.', 'success');
    } catch (e) {
      showToast('Could not save measurements to storage.', 'error');
    }
  };



  // Live analytics (Clothing Size Recommendation)

  const sizeRecommendation = useMemo(() => {
    return calculateRecommendedSize(measurements.chest, measurements.belly);
  }, [measurements.chest, measurements.belly]);

  // Filtered fields based on active tab
  const filteredFields = useMemo(() => {
    if (activeTab === 'all') return MEASUREMENT_FIELDS;
    return MEASUREMENT_FIELDS.filter((f) => f.category === activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white pt-24 lg:pt-28">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-24 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md transition-all transform duration-300 border text-sm font-medium ${toast.type === 'error'
            ? 'bg-rose-950/90 border-rose-600 text-rose-200'
            : toast.type === 'info'
              ? 'bg-sky-950/90 border-sky-600 text-sky-200'
              : 'bg-emerald-950/90 border-emerald-600 text-emerald-200'
            }`}
        >
          <span>{toast.type === 'error' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '✓'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Atelier Sub-Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-lg px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Shop</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-sm md:text-base font-bold tracking-wider uppercase text-white font-['Outfit']">
                3D Virtual Fitting & Body Atelier
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Shape-Key Anatomical Calibration • Real-Time Fitting Studio
            </p>
          </div>
        </div>

        {/* Global Controls: Unit Switcher & Quick Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Unit Toggle Switch */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${unitSystem === 'metric'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              Metric (cm)
            </button>
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${unitSystem === 'imperial'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              Imperial (in)
            </button>
          </div>

            {/* Try Virtual Fit Direct CTA Button */}
            <Link
              to="/virtual-fitting"
              state={{ measurements }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold tracking-wide shadow-md shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
              <span>Try Virtual Fit</span>
              <span>→</span>
            </Link>

          {/* Reset All */}
          <button
            onClick={handleResetAll}
            title="Reset all measurements to defaults"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">

        {/* LEFT / CENTER: 3D Viewport Area (lg:col-span-7 xl:col-span-8) */}
        <div className="lg:col-span-7 xl:col-span-8 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col min-h-[500px] lg:min-h-[calc(100vh-175px)] border-b lg:border-b-0 lg:border-r border-slate-800/70">

          {/* Top-Left Floating Studio View Controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
            {/* Camera Angles Toolbar */}
            <div className="bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 flex items-center shadow-xl">
              <button
                onClick={() => setCameraView('front')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${cameraView === 'front' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
              >
                Front
              </button>
              <button
                onClick={() => setCameraView('side')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${cameraView === 'side' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
              >
                Profile / Side
              </button>
              <button
                onClick={() => setCameraView('back')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${cameraView === 'back' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
              >
                Back
              </button>
              <button
                onClick={() => setCameraView('perspective')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${cameraView === 'perspective' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
              >
                3/4 View
              </button>
            </div>

            {/* Turntable Auto-Rotate Button */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border backdrop-blur-md transition-all flex items-center gap-1.5 shadow-xl ${isAutoRotating
                ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white'
                }`}
            >
              <span className={isAutoRotating ? 'animate-spin inline-block' : ''}>↻</span>
              <span>{isAutoRotating ? 'Rotating 360°' : '360° Turntable'}</span>
            </button>
          </div>

          {/* Top-Right Floating Controls (Wireframe Toggle) */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            {/* Wireframe toggle */}
            <button
              onClick={() => setShowWireframe(!showWireframe)}
              title="Toggle Mesh Topology Wireframe"
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border backdrop-blur-md transition-all flex items-center gap-1.5 shadow-xl ${showWireframe
                ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white'
                }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>{showWireframe ? 'Wireframe On' : 'Wireframe'}</span>
            </button>
          </div>

          {/* Three.js Canvas Container */}
          <div className="flex-1 w-full h-full relative">
            <BodyModelCanvas
              ref={canvasRef}
              measurements={measurements}
              showWireframe={showWireframe}
              isAutoRotating={isAutoRotating}
              cameraView={cameraView}
            />
          </div>

          {/* Bottom Overlay: Orbit Instructions & Live Sizing Card */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex flex-wrap items-end justify-between gap-4 z-10">
            {/* Interactive hint badge */}
            <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 shadow-lg">
              <svg className="w-3.5 h-3.5 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span>Left-click + drag to orbit • Right-click to pan • Scroll wheel to zoom</span>
            </div>

            {/* Smart Size & Fit Recommendation Card */}
            <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-4 max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex flex-col items-center justify-center text-white shadow-md shrink-0 font-bold">
                <span className="text-sm leading-none">{sizeRecommendation.size}</span>
                <span className="text-[9px] uppercase tracking-tighter opacity-90">SIZE</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white tracking-wide uppercase truncate">
                    {sizeRecommendation.label}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Fit recommendation based on your chest ({toDisplayValue('chest', measurements.chest, unitSystem)} {unitSystem === 'metric' ? 'cm' : 'in'}) & waist.
                </p>
                <div className="flex items-center gap-2.5 mt-2">
                  <Link
                    to="/virtual-fitting"
                    state={{ measurements }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 px-3 py-1.5 rounded-xl shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95 group"
                  >
                    <span>Try Virtual Fit</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    to="/shop"
                    className="text-[11px] font-semibold text-slate-400 hover:text-sky-300 transition-colors"
                  >
                    Shop →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Parameter Controls & Slider Adjustment Panel (lg:col-span-5 xl:col-span-4) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-slate-950 flex flex-col h-auto lg:h-[calc(100vh-175px)] overflow-y-auto border-l border-slate-800/80">

          {/* Category Filter Tabs */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all text-center ${activeTab === 'all' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                All ({MEASUREMENT_FIELDS.length})
              </button>
              <button
                onClick={() => setActiveTab('torso')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all text-center ${activeTab === 'torso' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Torso
              </button>
              <button
                onClick={() => setActiveTab('upper')}
                className={`flex-1 py-1 rounded-lg font-medium transition-all text-center ${activeTab === 'upper' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Upper Body
              </button>
            </div>
          </div>

          {/* Parameter Sliders & Number Input Boxes List */}
          <div className="p-5 space-y-5 flex-1">
            {filteredFields.map((field) => {
              const bounds = unitSystem === 'metric' ? field.metric : field.imperial;
              const currentMetric = measurements[field.key] ?? bounds.default;
              const currentDisplayVal = toDisplayValue(field.key, currentMetric, unitSystem);
              const inputValue = typeBoxValues[field.key] !== undefined ? typeBoxValues[field.key] : currentDisplayVal;
              const progressPct = Math.max(0, Math.min(100, ((currentDisplayVal - bounds.min) / (bounds.max - bounds.min)) * 100));

              return (
                <div
                  key={field.key}
                  className="bg-slate-900/70 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 transition-all group"
                >
                  {/* Field Header: Label, Description & Reset Button */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                          {field.label}
                        </span>
                        {field.shapeKey && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                            {field.shapeKey}
                          </span>
                        )}
                        {field.key === 'belly' && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-950/90 text-sky-400 border border-sky-800/80" title="Synchronizes Weight shape key automatically">
                            + Weight sync
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {field.description}
                      </p>
                    </div>

                    {/* Reset single parameter button */}
                    <button
                      onClick={() => handleResetSingle(field.key)}
                      title={`Reset ${field.label} to default`}
                      className="text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-slate-800 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>

                  {/* Interactive Slider & Type Box Row */}
                  <div className="flex items-center gap-3 pt-1">
                    {/* Left: Range Slider with smooth dynamic gradient */}
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="range"
                        min={bounds.min}
                        max={bounds.max}
                        step={bounds.step}
                        value={currentDisplayVal}
                        onChange={(e) => handleSliderChange(field.key, e.target.value)}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 focus:outline-none accent-sky-500"
                        style={{
                          background: `linear-gradient(to right, #0284c7 0%, #38bdf8 ${progressPct}%, #1e293b ${progressPct}%, #1e293b 100%)`,
                        }}
                      />
                    </div>

                    {/* Right: Direct Number Input Box placed right near slider */}
                    <div className="flex items-center bg-slate-950 border border-slate-700/90 focus-within:border-sky-500 rounded-xl px-2.5 py-1.5 shadow-inner transition-colors shrink-0 w-28">
                      <input
                        type="number"
                        min={bounds.min}
                        max={bounds.max}
                        step={bounds.step}
                        value={inputValue}
                        onChange={(e) => handleTypeBoxChange(field.key, e.target.value)}
                        onBlur={() => handleTypeBoxBlur(field.key)}
                        className="w-full bg-transparent text-sm font-bold font-mono text-white text-right focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="text-xs font-semibold text-sky-400 ml-1.5 select-none shrink-0">
                        {bounds.unit}
                      </span>
                    </div>
                  </div>

                  {/* Range Boundaries & Current Value Indicator */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1.5 px-0.5">
                    <span>Min: {bounds.min} {bounds.unit}</span>
                    <span className="text-sky-400/90 font-medium">
                      Default: {bounds.default} {bounds.unit}
                    </span>
                    <span>Max: {bounds.max} {bounds.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Panel Footer: Action Cards */}
          <div className="p-5 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                <span className="text-white font-semibold block">Need personalized tailoring?</span>
                <span>Your avatar dimensions can guide your next order.</span>
              </div>
              <Link
                to="/shop"
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-950/60 transition-all uppercase tracking-wider shrink-0"
              >
                Shop Collection →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BodyViewport;
