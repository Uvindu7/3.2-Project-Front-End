import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const ThreeDProductCard = ({
  Model,
  badge = 'BACK TO 2D',
  badgeIcon = '🎮',
  onBadgeClick,
  cameraPosition = [0, 0, 2.5],
  fov = 50,
  enableZoom = true,
  enablePan = true,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-gray-200 relative aspect-square overflow-hidden flex items-center justify-center">

        {badge && (
          <span
            onClick={onBadgeClick}
            className={`absolute top-4 right-4 md:top-6 md:right-6 bg-black/80 text-white px-3 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wider flex items-center gap-2 backdrop-blur-md z-10 ${onBadgeClick ? 'cursor-pointer' : ''}`}
          >
            {badgeIcon && <span>{badgeIcon}</span>}
            {badge}
          </span>
        )}

        <div className="w-full h-full min-h-[320px]">
          <Canvas
            camera={{ position: [0, 0, 2.5], fov: 50 }}
            className="w-full h-full"
          >
            <ambientLight intensity={1} />
            <directionalLight position={[2, 2, 2]} intensity={1.5} />

            <Suspense fallback={null}>
              <Model />
            </Suspense>

            {/* Enables rotate + zoom + pan */}
            <OrbitControls enableZoom={true} enablePan={true} />
          </Canvas>

        </div>


      </div>
    </div>
  );
};

export default ThreeDProductCard;
