import React from 'react';
import { SoftShadows } from '@react-three/drei';
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
} from '@react-three/postprocessing';

/**
 * Loaded only for medium/high graphics quality. Phones start in Low mode, so
 * they no longer download or evaluate the post-processing stack on entry.
 */
export default function SceneEffects({ quality }) {
  return (
    <>
      {quality === 'high' && <SoftShadows size={12} samples={8} />}
      <EffectComposer multisampling={quality === 'high' ? 4 : 0}>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
        <ChromaticAberration offset={[0.0006, 0.0006]} />
        <Vignette eskil={false} offset={0.25} darkness={0.9} />
      </EffectComposer>
    </>
  );
}
