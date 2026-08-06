import React, { useMemo } from 'react';
import { Environment as DreiEnvironment } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import Floor from '../environment/Floor';
import FacilityLighting from '../environment/FacilityLighting';
import CeilingStructure from '../environment/CeilingStructure';
import AICore from './AICore';
import ServerRackField, { RACK_LAYOUT } from './ServerRackField';
import NetworkCables from './NetworkCables';
import CoolingSystem from './CoolingSystem';

export default function DataCenterScene({ quality, reducedMotion }) {
  const dayNight = useStore((s) => s.dayNight);

  const rackPositions = useMemo(() => RACK_LAYOUT, []);

  return (
    <group>
      <FacilityLighting dayNight={dayNight} quality={quality} />
      <DreiEnvironment preset={dayNight === 'night' ? 'night' : 'city'} environmentIntensity={0.25} />

      <Floor quality={quality} />
      <CeilingStructure />

      <AICore position={[0, 2.4, 0]} />

      <ServerRackField layout={rackPositions} quality={quality} />

      <NetworkCables racks={rackPositions} reducedMotion={reducedMotion} />

      <CoolingSystem position={[-13, 0, -8]} reducedMotion={reducedMotion} />
      <CoolingSystem position={[13, 0, -8]} reducedMotion={reducedMotion} />
    </group>
  );
}
