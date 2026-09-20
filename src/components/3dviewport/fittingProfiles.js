// Fitting Profiles and Shape-Key Matching Engine
// Maps custom user measurements / shape keys to the closest pre-tailored 3D body + garment model

import { MEASUREMENT_FIELDS, getMorphInfluence } from './measurementConfig.js';

export const FITTING_PROFILES = [
  {
    id: '3',
    name: 'Standard Lean Frame',
    tag: 'Profile #3',
    description: 'Slender posture with baseline chest and slim torso.',
    weights: {
      shoulder_width: 0.0,
      chest: 0.0,
      belly: 0.0,
      neck_width: 0.0,
      upperbody: 1.0,
      Weight: 1.0,
    },
    files: {
      small: '/models/3d-models/small/3s.glb',
      medium: '/models/3d-models/medium/3M.glb',
      large: '/models/3d-models/large/3L.glb',
    },
  },
  {
    id: '4',
    name: 'Mid-Shoulder Balanced',
    tag: 'Profile #4',
    description: 'Medium shoulder breadth with standard torso taper.',
    weights: {
      shoulder_width: 0.5,
      chest: 0.0,
      belly: 0.0,
      neck_width: 0.0,
      upperbody: 1.0,
      Weight: 1.0,
    },
    files: {
      small: '/models/3d-models/small/4s.glb',
      medium: '/models/3d-models/medium/4M.glb',
      large: '/models/3d-models/large/4L.glb',
    },
  },
  {
    id: '5',
    name: 'Athletic Slim Silhouette',
    tag: 'Profile #5',
    description: 'Narrow athletic build with fitted abdominal profile.',
    weights: {
      shoulder_width: 0.0,
      chest: 0.0,
      belly: 0.0,
      neck_width: 0.0,
      upperbody: 1.0,
      Weight: 1.0,
    },
    files: {
      small: '/models/3d-models/small/5s.glb',
      medium: '/models/3d-models/medium/5M.glb',
      large: '/models/3d-models/large/5L.glb',
    },
  },
  {
    id: '11',
    name: 'Broad Athletic Build',
    tag: 'Profile #11',
    description: 'Developed upper torso, broad shoulders, and moderate waist.',
    weights: {
      shoulder_width: 0.8,
      chest: 0.75,
      belly: 0.3,
      neck_width: 0.35,
      upperbody: 1.0,
      Weight: 1.0,
    },
    files: {
      small: null,
      medium: '/models/3d-models/medium/11M.glb',
      large: '/models/3d-models/large/11L.glb',
    },
  },
  {
    id: '12',
    name: 'Power Muscular Frame',
    tag: 'Profile #12',
    description: 'Heavy chest musculature, broad shoulders, and solid waistline.',
    weights: {
      shoulder_width: 0.9,
      chest: 0.85,
      belly: 0.4,
      neck_width: 0.4,
      upperbody: 1.0,
      Weight: 1.0,
    },
    files: {
      small: null,
      medium: '/models/3d-models/medium/12M.glb',
      large: '/models/3d-models/large/12L.glb',
    },
  },
  {
    id: '16',
    name: 'Fuller Torso & Waist',
    tag: 'Profile #16',
    description: 'Generous chest and waist circumference with wide upper frame.',
    weights: {
      shoulder_width: 0.8014,
      chest: 0.8212,
      belly: 0.9,
      neck_width: 0.4315,
      upperbody: 1.0,
      Weight: 1.0,
    },
    files: {
      small: '/models/3d-models/small/16s.glb',
      medium: '/models/3d-models/medium/16M.glb',
      large: '/models/3d-models/large/16L.glb',
    },
  },
  {
    id: '17',
    name: 'Solid Robust Build',
    tag: 'Profile #17',
    description: 'Substantial upper volume with mid-to-full waistline.',
    weights: {
      shoulder_width: 0.85,
      chest: 0.75,
      belly: 0.65,
      neck_width: 0.4,
      upperbody: 1.0,
      Weight: 1.0,
    },
    files: {
      small: null,
      medium: '/models/3d-models/medium/17M.glb',
      large: '/models/3d-models/large/17L.glb',
    },
  },
  {
    id: '19',
    name: 'Athletic V-Taper Frame',
    tag: 'Profile #19',
    description: 'Wide shoulder span with a tight, tapered waistline.',
    weights: {
      shoulder_width: 0.85,
      chest: 0.55,
      belly: 0.25,
      neck_width: 0.3,
      upperbody: 1.0,
      Weight: 1.0,
    },
    files: {
      small: null,
      medium: '/models/3d-models/medium/19M.glb',
      large: '/models/3d-models/large/19L.glb',
    },
  },
  {
    id: '20',
    name: 'Maximum Volume (XXL Build)',
    tag: 'Profile #20',
    description: 'Maximum width across chest, stomach, and shoulders.',
    weights: {
      shoulder_width: 1.0,
      chest: 1.0,
      belly: 1.0,
      neck_width: 0.4315,
      upperbody: 1.0,
      Weight: 1.0,
    },
    files: {
      small: null,
      medium: '/models/3d-models/medium/20M.glb',
      large: '/models/3d-models/large/20L.glb',
    },
  },
];

/**
 * Converts metric measurements object into normalized shape-key influence map (0.0 to 1.0)
 */
export const getUserMorphInfluences = (measurements = {}) => {
  const influences = {};
  MEASUREMENT_FIELDS.forEach((field) => {
    const val = measurements[field.key] !== undefined ? measurements[field.key] : field.metric.default;
    influences[field.shapeKey || field.key] = getMorphInfluence(field, val);
  });
  return influences;
};

/**
 * Computes weighted anatomical Euclidean distance and returns the closest body model profile
 */
export const findBestMatchingProfile = (measurements = {}) => {
  const userWeights = getUserMorphInfluences(measurements);

  // Importance weights for shape-key dimensions (chest & belly affect garment fit most)
  const dimensionWeights = {
    chest: 2.2,
    belly: 2.2,
    shoulder_width: 1.5,
    neck_width: 0.6,
  };

  let bestProfile = FITTING_PROFILES[0];
  let minDistance = Infinity;

  FITTING_PROFILES.forEach((profile) => {
    let distance = 0;
    for (const [key, weight] of Object.entries(dimensionWeights)) {
      const uVal = userWeights[key] ?? 0;
      const pVal = profile.weights[key] ?? 0;
      distance += weight * Math.pow(uVal - pVal, 2);
    }

    if (distance < minDistance) {
      minDistance = distance;
      bestProfile = profile;
    }
  });

  // Calculate percentage confidence (72% - 99%)
  const confidence = Math.max(72, Math.min(99, Math.round(100 - Math.sqrt(minDistance) * 22)));

  return {
    profile: bestProfile,
    confidence,
    userWeights,
  };
};
