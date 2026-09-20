// Configuration and utilities for 3D Body Measurements, Shape Keys, and Presets

export const MEASUREMENT_FIELDS = [
  {
    key: 'chest',
    label: 'Chest / Bust Circumference',
    category: 'torso',
    shapeKey: 'chest',
    icon: 'heart-pulse',
    description: 'Fullest circumference across the chest/bust, keeping the tape level.',
    metric: { min: 75, max: 130, default: 96, step: 0.5, unit: 'cm' },
    imperial: { min: 30, max: 51, default: 38, step: 0.2, unit: 'in' },
  },
  {
    key: 'belly',
    label: 'Waist / Stomach',
    category: 'torso',
    shapeKey: 'belly',
    icon: 'circle-dot',
    description: 'Circumference around navel / abdomen area. Automatically controls body weight shape key.',
    metric: { min: 60, max: 125, default: 80, step: 0.5, unit: 'cm' },
    imperial: { min: 24, max: 49, default: 31.5, step: 0.2, unit: 'in' },
  },
  {
    key: 'shoulder_width',
    label: 'Shoulder Width',
    category: 'upper',
    shapeKey: 'shoulder_width',
    icon: 'expand-horizontal',
    description: 'Distance across shoulders from acromion bone to bone.',
    metric: { min: 36, max: 56, default: 44, step: 0.5, unit: 'cm' },
    imperial: { min: 14, max: 22, default: 17.5, step: 0.2, unit: 'in' },
  },
  {
    key: 'upperbody',
    label: 'Upper Body Torso Volume',
    category: 'upper',
    shapeKey: 'upperbody',
    icon: 'shield',
    description: 'Torso muscularity, ribcage depth, and upper back volume.',
    metric: { min: 40, max: 65, default: 50, step: 0.5, unit: 'cm' },
    imperial: { min: 16, max: 26, default: 20, step: 0.2, unit: 'in' },
  },
  {
    key: 'neck_width',
    label: 'Neck Circumference',
    category: 'upper',
    shapeKey: 'neck_width',
    icon: 'user-circle',
    description: 'Circumference around mid-neck just above Adam\'s apple/collarbone.',
    metric: { min: 30, max: 50, default: 38, step: 0.5, unit: 'cm' },
    imperial: { min: 12, max: 20, default: 15, step: 0.2, unit: 'in' },
  }
];

// Quick Body Type Presets (in Metric values)
export const BODY_PRESETS = [
  {
    id: 'athletic',
    name: 'Athletic / Toned',
    tagline: 'Balanced athletic build',
    values: {
      chest: 98,
      belly: 79,
      shoulder_width: 47,
      upperbody: 53,
      neck_width: 39,
    },
  },
  {
    id: 'slim',
    name: 'Slim / Lean',
    tagline: 'Slender, minimalist frame',
    values: {
      chest: 88,
      belly: 72,
      shoulder_width: 42,
      upperbody: 45,
      neck_width: 35,
    },
  },
  {
    id: 'muscular',
    name: 'Muscular / Power',
    tagline: 'Broader chest & shoulders',
    values: {
      chest: 114,
      belly: 84,
      shoulder_width: 52,
      upperbody: 60,
      neck_width: 43,
    },
  },
  {
    id: 'curvy',
    name: 'Fuller / Curvy',
    tagline: 'Generous chest & waist',
    values: {
      chest: 110,
      belly: 98,
      shoulder_width: 45,
      upperbody: 54,
      neck_width: 39,
    },
  },
  {
    id: 'tall',
    name: 'Broad Frame',
    tagline: 'Elongated silhouette',
    values: {
      chest: 96,
      belly: 78,
      shoulder_width: 48,
      upperbody: 52,
      neck_width: 38,
    },
  },
];

// Unit conversions
export const cmToInches = (cm) => +(cm / 2.54).toFixed(1);
export const inchesToCm = (inches) => +(inches * 2.54).toFixed(1);
export const kgToLbs = (kg) => +(kg * 2.20462).toFixed(1);
export const lbsToKg = (lbs) => +(lbs / 2.20462).toFixed(1);

// Convert internal metric values to selected unit display
export const toDisplayValue = (key, metricValue, unitSystem) => {
  if (unitSystem === 'metric') return metricValue;
  if (key === 'weight') return kgToLbs(metricValue);
  return cmToInches(metricValue);
};

// Convert user input in selected unit back to internal metric value
export const toMetricValue = (key, displayValue, unitSystem) => {
  const val = parseFloat(displayValue);
  if (isNaN(val)) return 0;
  if (unitSystem === 'metric') return val;
  if (key === 'weight') return lbsToKg(val);
  return inchesToCm(val);
};

// Compute morph target weight (0.0 to 1.0) from metric measurement
export const getMorphInfluence = (fieldConfig, metricValue) => {
  const { min, max } = fieldConfig.metric;
  const clamped = Math.max(min, Math.min(max, metricValue));
  return (clamped - min) / (max - min);
};

// Compute BMI & Status
export const calculateBMI = (weightKg, heightCm = 175) => {
  if (!weightKg) return { bmi: 22.0, status: 'Normal', color: 'text-emerald-500' };
  const heightMeters = heightCm / 100;
  const bmi = +(weightKg / (heightMeters * heightMeters)).toFixed(1);

  if (bmi < 18.5) return { bmi, status: 'Underweight', color: 'text-amber-500' };
  if (bmi < 25.0) return { bmi, status: 'Normal weight', color: 'text-emerald-600' };
  if (bmi < 30.0) return { bmi, status: 'Overweight', color: 'text-amber-600' };
  return { bmi, status: 'Fuller build', color: 'text-purple-600' };
};

// Recommend clothing size based on chest & waist
export const calculateRecommendedSize = (chestCm, waistCm) => {
  if (!chestCm) return { size: 'M', fit: 'Regular Fit', confidence: '92%' };

  if (chestCm < 88) return { size: 'XS', fit: 'Slim Fit', label: 'Extra Small (XS)' };
  if (chestCm <= 94) return { size: 'S', fit: 'Tailored Fit', label: 'Small (S)' };
  if (chestCm <= 102) return { size: 'M', fit: 'Regular Fit', label: 'Medium (M)' };
  if (chestCm <= 110) return { size: 'L', fit: 'Classic Fit', label: 'Large (L)' };
  if (chestCm <= 118) return { size: 'XL', fit: 'Relaxed Fit', label: 'Extra Large (XL)' };
  return { size: 'XXL', fit: 'Comfort Fit', label: 'Double XL (2XL)' };
};

// Default initial state (all metric)
export const getDefaultMeasurements = () => {
  const defaults = {};
  MEASUREMENT_FIELDS.forEach((f) => {
    defaults[f.key] = f.metric.default;
  });
  return defaults;
};
