import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const FittedModelCanvas = ({
  modelUrl,
  sizeLabel = 'Medium',
  cameraView = 'front',
  isAutoRotating = false,
  shirtColor = '#1e293b', // Default sleek obsidian fabric
  onLoaded,
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const modelGroupRef = useRef(null);
  const shirtMaterialsRef = useRef([]);
  const targetCamPosRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

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

  // Update shirt fabric color live when shirtColor prop changes
  useEffect(() => {
    shirtMaterialsRef.current.forEach((mat) => {
      if (mat) {
        mat.color.set(shirtColor);
        mat.needsUpdate = true;
      }
    });
  }, [shirtColor]);

  // Setup Three.js scene & load fitted garment model
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !modelUrl) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    shirtMaterialsRef.current = [];

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.set(0, 0.1, 3.3);
    cameraRef.current = camera;

    // WebGL Renderer with soft shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.2;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // ── High-Contrast Studio Lighting ──
    const hemiLight = new THREE.HemisphereLight(0xfff0e8, 0x1e293b, 0.28);
    scene.add(hemiLight);

    // Key Light (warm, front-right, shadow casting)
    const keyLight = new THREE.DirectionalLight(0xfff5e8, 2.2);
    keyLight.position.set(2.5, 5.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -2.2;
    keyLight.shadow.camera.right = 2.2;
    keyLight.shadow.camera.top = 3.8;
    keyLight.shadow.camera.bottom = -2.2;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.03;
    scene.add(keyLight);

    // Secondary Key (cool, left-back, shadow casting)
    const key2Light = new THREE.DirectionalLight(0xe8f4ff, 1.1);
    key2Light.position.set(-2.8, 4.0, -2.0);
    key2Light.castShadow = true;
    key2Light.shadow.mapSize.width = 1024;
    key2Light.shadow.mapSize.height = 1024;
    key2Light.shadow.camera.near = 0.5;
    key2Light.shadow.camera.far = 20;
    key2Light.shadow.camera.left = -2.0;
    key2Light.shadow.camera.right = 2.0;
    key2Light.shadow.camera.top = 3.5;
    key2Light.shadow.camera.bottom = -2.0;
    key2Light.shadow.bias = -0.0003;
    scene.add(key2Light);

    // Rim Light (silhouette definition)
    const rimLight = new THREE.DirectionalLight(0xddeeff, 0.75);
    rimLight.position.set(0, 4.5, -5);
    scene.add(rimLight);

    // Under-light
    const underLight = new THREE.DirectionalLight(0xfff0e0, 0.18);
    underLight.position.set(0, -3, 2);
    scene.add(underLight);

    // Invisible shadow-catching floor plane
    const shadowFloorGeo = new THREE.PlaneGeometry(8, 8);
    const shadowFloorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowFloor = new THREE.Mesh(shadowFloorGeo, shadowFloorMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -1.28;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // Studio Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.35, 1.45, 0.04, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.15,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.25;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Decorative outer neon ring on pedestal
    const ringGeo = new THREE.RingGeometry(1.36, 1.42, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.22;
    scene.add(ring);

    // Model group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Load GLTF
    const loader = new GLTFLoader();
    const resolvedUrl = `${process.env.PUBLIC_URL || ''}${modelUrl}`;

    loader.load(
      resolvedUrl,
      (gltf) => {
        const loadedScene = gltf.scene;

        // Compute Bounding Box to center and scale uniformly
        const box = new THREE.Box3().setFromObject(loadedScene);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);

        // Center mesh
        loadedScene.position.set(-center.x, -center.y, -center.z);

        // Scale uniformly to ~2.3 height
        const targetHeight = 2.3;
        const uniformScale = targetHeight / (size.y || 9.0);
        modelGroup.scale.set(uniformScale, uniformScale, uniformScale);

        // Traverse and apply materials
        const shirtMats = [];
        loadedScene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const isClothingMesh =
              child.name.toLowerCase().includes('cube') ||
              (!child.morphTargetDictionary && !child.morphTargetInfluences);

            if (isClothingMesh) {
              // Garment / T-shirt fabric material
              const garmentMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(shirtColor),
                roughness: 0.88,
                metalness: 0.04,
                side: THREE.DoubleSide,
              });
              child.material = garmentMat;
              shirtMats.push(garmentMat);
            } else {
              // Body / Skin material (Natural matte skin with subtle warm depth)
              const skinMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0xd7a885),
                roughness: 0.82,
                metalness: 0.0,
                emissive: new THREE.Color(0x4a1e08),
                emissiveIntensity: 0.08,
                envMapIntensity: 0.0,
                flatShading: false,
              });
              child.material = skinMat;
            }
          }
        });

        shirtMaterialsRef.current = shirtMats;
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
        console.error('Error loading fitted 3D model:', error);
        setLoadError('Failed to load fitted garment model asset.');
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

      // Smooth camera interpolation
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
  }, [modelUrl, onLoaded]);

  // Graceful Unavailable Size View
  if (!modelUrl) {
    return (
      <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 rounded-3xl border border-dashed border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
          <span>Size Unavailable</span>
        </div>
        <h3 className="text-base font-bold text-white font-['Outfit'] mb-2">
          {sizeLabel} is not available for this body size
        </h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
          Based on your customized upper body and chest measurements, your anatomical build exceeds the dimension thresholds of a {sizeLabel} garment.
        </p>
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-300">
          <span className="text-sky-400 font-semibold">Recommendation: </span>
          Please select <strong className="text-white">Medium (M)</strong> or <strong className="text-white">Large (L)</strong> for a comfortable, properly draped fit.
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[420px] select-none rounded-3xl overflow-hidden bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
      {/* 3D Canvas Mounting Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md text-white">
          <div className="relative w-14 h-14 mb-3 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-3 border-slate-700 border-t-sky-500 animate-spin" />
            <span className="text-xs font-mono text-sky-400 font-semibold">
              {loadingProgress > 0 ? `${loadingProgress}%` : '...'}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-300">Fitting {sizeLabel} Garment...</p>
        </div>
      )}

      {/* Error Overlay */}
      {loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 p-4 text-center text-rose-400">
          <p className="text-xs font-semibold mb-1 text-white">Garment Model Notice</p>
          <p className="text-[11px] text-slate-400 max-w-xs">{loadError}</p>
        </div>
      )}
    </div>
  );
};

export default FittedModelCanvas;
