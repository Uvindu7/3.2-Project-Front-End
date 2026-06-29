import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const TShirtModel = () => {
  const { scene } = useGLTF('/images/oversized_t-shirt.glb');
  const groupRef = useRef();

  useEffect(() => {
    if (!scene) return;

    // Compute the model's bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    // Shift geometry so the bounding-box center sits at origin
    scene.position.set(-center.x, -center.y, -center.z);

    // Uniform scale so the largest dimension fits inside 2 units
    const maxDim = Math.max(size.x, size.y, size.z);
    if (groupRef.current) {
      const targetSize = 2;
      groupRef.current.scale.setScalar(targetSize / maxDim);
    }
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/images/oversized_t-shirt.glb');

export default TShirtModel;
