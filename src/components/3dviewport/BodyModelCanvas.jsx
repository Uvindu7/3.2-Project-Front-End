import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MEASUREMENT_FIELDS, getMorphInfluence } from './measurementConfig';

const BodyModelCanvas = forwardRef(({
  measurements,
  materialMode = 'realistic',
  showWireframe = false,
  isAutoRotating = false,
  cameraView = 'front', // 'front', 'side', 'back', 'perspective'
  onLoaded,
}, ref) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const modelGroupRef = useRef(null);
  const meshRef = useRef(null);
  const originalMaterialsRef = useRef([]);
  const targetCamPosRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Expose snapshot method to parent component
  useImperativeHandle(ref, () => ({
    takeSnapshot: () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return null;
      // Force render before taking snapshot
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      return rendererRef.current.domElement.toDataURL('image/png');
    },
    resetCamera: () => {
      setCameraAngle('front');
    }
  }));

  // Camera preset positions
  const setCameraAngle = useCallback((view) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const dist = 3.3;
    let targetPos = new THREE.Vector3(0, 0.1, dist);

    switch (view) {
      case 'front':
        targetPos = new THREE.Vector3(0, 0.1, dist);
        break;
      case 'side':
        targetPos = new THREE.Vector3(dist, 0.1, 0);
        break;
      case 'back':
        targetPos = new THREE.Vector3(0, 0.1, -dist);
        break;
      case 'perspective':
        targetPos = new THREE.Vector3(2.3, 0.9, 2.3);
        break;
      default:
        targetPos = new THREE.Vector3(0, 0.1, dist);
    }

    targetCamPosRef.current = targetPos;
  }, []);

  // React to cameraView prop changes
  useEffect(() => {
    if (cameraView) {
      setCameraAngle(cameraView);
    }
  }, [cameraView, setCameraAngle]);

  // Setup Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.set(0, 0.1, 3.3);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // ── Shadows ──────────────────────────────────────────────
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;   // soft, blurred shadow edges
    // ─────────────────────────────────────────────────────────
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.2;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Prevent going underneath floor
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // ── Lighting Setup — high-contrast studio for body-part clarity ──
    //
    // DESIGN: Low ambient + strong directional = shadow areas stay dark
    // so anatomy (arms, torso, legs) is visually separated.
    // A 4:1 key-to-ambient ratio is used (photographic portrait standard).
    //
    // Hemisphere ambient — very dim, just prevents pure-black shadows
    const hemiLight = new THREE.HemisphereLight(0xfff0e8, 0x1e293b, 0.22);
    scene.add(hemiLight);

    // ── Key Light (front-right, high, SHADOW CASTING) ──
    // Strong warm light from upper-right creates clear shadow on left arm/torso
    const keyLight = new THREE.DirectionalLight(0xfff5e8, 2.4);
    keyLight.position.set(2.5, 5.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width  = 4096;   // higher res = sharper shadow edges
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.camera.near   = 0.5;
    keyLight.shadow.camera.far    = 22;
    keyLight.shadow.camera.left   = -2.2;
    keyLight.shadow.camera.right  =  2.2;
    keyLight.shadow.camera.top    =  3.8;
    keyLight.shadow.camera.bottom = -2.2;
    keyLight.shadow.bias          = -0.0004;
    keyLight.shadow.normalBias    = 0.03;
    scene.add(keyLight);

    // ── Secondary Key (left-back, SHADOW CASTING) ──
    // Creates opposing shadows — defines the OTHER side of the body,
    // making both arms/legs look separate from the torso.
    const key2Light = new THREE.DirectionalLight(0xe8f4ff, 1.2);
    key2Light.position.set(-2.8, 4.0, -2.0);
    key2Light.castShadow = true;
    key2Light.shadow.mapSize.width  = 2048;
    key2Light.shadow.mapSize.height = 2048;
    key2Light.shadow.camera.near   = 0.5;
    key2Light.shadow.camera.far    = 22;
    key2Light.shadow.camera.left   = -2.0;
    key2Light.shadow.camera.right  =  2.0;
    key2Light.shadow.camera.top    =  3.5;
    key2Light.shadow.camera.bottom = -2.0;
    key2Light.shadow.bias          = -0.0003;
    key2Light.shadow.normalBias    = 0.02;
    scene.add(key2Light);

    // ── Rim Light (directly behind — silhouette separation) ──
    // Outlines shoulders, hips and head against the background
    const rimLight = new THREE.DirectionalLight(0xddeeff, 0.8);
    rimLight.position.set(0, 4.5, -5);
    scene.add(rimLight);

    // ── Under-fill (very subtle, prevents pure black crotch/armpit) ──
    const underLight = new THREE.DirectionalLight(0xfff0e0, 0.18);
    underLight.position.set(0, -3, 2);
    scene.add(underLight);
    // ─────────────────────────────────────────────────────────

    // ── Invisible shadow-catching floor (under the pedestal) ──
    const shadowFloorGeo = new THREE.PlaneGeometry(8, 8);
    const shadowFloorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowFloor = new THREE.Mesh(shadowFloorGeo, shadowFloorMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -1.28;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // Circular Studio Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.04, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.15,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.25;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Decorative outer glowing ring on pedestal
    const ringGeo = new THREE.RingGeometry(1.42, 1.48, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.22;
    scene.add(ring);

    // Model group holder
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Load GLTF Model
    const loader = new GLTFLoader();
    const modelUrl = `${process.env.PUBLIC_URL || ''}/models/fmodelskey.glb?v=2`;

    loader.load(
      modelUrl,
      (gltf) => {
        const loadedScene = gltf.scene;

        // Compute Bounding Box to center and normalize scale
        const box = new THREE.Box3().setFromObject(loadedScene);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);

        // Center loaded mesh at (0, 0, 0)
        loadedScene.position.set(-center.x, -center.y, -center.z);

        // Scale uniformly to fit nicely in 2.3 unit height
        const targetHeight = 2.3;
        const uniformScale = targetHeight / (size.y || 9.0);
        modelGroup.scale.set(uniformScale, uniformScale, uniformScale);
        modelGroup.userData.baseScale = uniformScale;

        // Find mesh with morph targets
        let targetMesh = null;
        const origMats = [];

        loadedScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow    = true;
            child.receiveShadow = true;

            // MeshStandardMaterial — realistic diffuse + shadow receiving
            // roughness: 0.82  → slightly glossy so light graduation is visible across body curves
            // emissive warmth: warms shadow areas so they read as skin not grey
            // envMapIntensity: 0 → zero environment reflections
            const skinMat = new THREE.MeshStandardMaterial({
              color:              new THREE.Color(0xd7a885),
              roughness:          0.82,
              metalness:          0.0,
              emissive:           new THREE.Color(0x4a1e08), // warm amber in shadow areas
              emissiveIntensity:  0.09,
              envMapIntensity:    0.0,
              flatShading:        false,                      // smooth normals = smooth body contours
            });
            child.material = skinMat;

            if (child.morphTargetDictionary && child.morphTargetInfluences) {
              targetMesh = child;
            }
            origMats.push(skinMat.clone());
          }
        });

        meshRef.current = targetMesh;
        originalMaterialsRef.current = origMats;
        modelGroup.add(loadedScene);

        setIsLoading(false);
        if (onLoaded) onLoaded();
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (error) => {
        console.error('Error loading 3D human model:', error);
        setLoadError('Failed to load 3D model asset. Please ensure the model file is accessible.');
        setIsLoading(false);
      }
    );

    // Resize listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth camera position interpolation when a preset view is chosen
      if (targetCamPosRef.current && cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.08);
        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.01) {
          targetCamPosRef.current = null;
        }
      }

      // Turntable auto-rotate
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotating;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onLoaded]);

  // Update Morph Targets & Height Scaling when measurements change
  useEffect(() => {
    const mesh = meshRef.current;
    const modelGroup = modelGroupRef.current;
    if (!mesh || !modelGroup || !measurements) return;

    const dict = mesh.morphTargetDictionary;
    const influences = mesh.morphTargetInfluences;

    if (dict && influences) {
      MEASUREMENT_FIELDS.forEach((field) => {
        if (field.shapeKey && dict[field.shapeKey] !== undefined) {
          const index = dict[field.shapeKey];
          const val = measurements[field.key] !== undefined ? measurements[field.key] : field.metric.default;
          const weight = getMorphInfluence(field, val);
          influences[index] = weight;
        }
      });

      // Automatically sync Weight shape key with waist/stomach (belly) slider
      const weightIndex = dict['Weight'] !== undefined ? dict['Weight'] : dict['weight'];
      if (weightIndex !== undefined) {
        const bellyField = MEASUREMENT_FIELDS.find((f) => f.key === 'belly');
        const bellyVal = measurements.belly !== undefined ? measurements.belly : (bellyField ? bellyField.metric.default : 80);
        const weightInfluence = bellyField
          ? getMorphInfluence(bellyField, bellyVal)
          : Math.max(0, Math.min(1, (bellyVal - 60) / 65));
        influences[weightIndex] = weightInfluence;
      }
    }

    // Maintain standard calibrated scale
    const baseScale = modelGroup.userData.baseScale || 0.25;
    modelGroup.scale.set(baseScale, baseScale, baseScale);
  }, [measurements]);

  // Update wireframe toggle (MeshStandardMaterial — realistic, matte, shadow-casting)
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.material.wireframe = showWireframe;
        child.material.needsUpdate = true;
      }
    });
  }, [showWireframe]);

  return (
    <div className="relative w-full h-full min-h-[480px] select-none">
      {/* 3D Canvas Mounting Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md text-white">
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-sky-500 animate-spin" />
            <span className="text-sm font-semibold tracking-wider font-mono text-sky-400">
              {loadingProgress > 0 ? `${loadingProgress}%` : '...'}
            </span>
          </div>
          <p className="text-sm font-medium tracking-wide text-slate-200">
            Initializing 3D Body Mesh & Shape Keys...
          </p>
          <span className="text-xs text-slate-400 mt-1">Calibrating anatomical geometry</span>
        </div>
      )}

      {/* Error Overlay */}
      {loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center text-rose-400">
          <div className="w-12 h-12 mb-3 rounded-full bg-rose-950/80 flex items-center justify-center border border-rose-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-base font-semibold mb-1 text-white">3D Model Notice</p>
          <p className="text-xs text-slate-300 max-w-sm mb-4">{loadError}</p>
        </div>
      )}
    </div>
  );
});

export default BodyModelCanvas;
