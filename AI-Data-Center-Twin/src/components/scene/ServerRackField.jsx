import React from 'react';
import ServerRack from './ServerRack';

const MODELS = ['NexusGPT-7', 'Titan-Infer-X', 'Athena-FT', 'Helios-V2', 'Orion-Base'];

function buildLayout() {
  const layout = [];
  const rows = [-9, -3, 3, 9]; // z positions (two rows on each side, aisle down the middle handled by x split)
  const cols = 5;
  let id = 1;

  [-1, 1].forEach((side) => {
    rows.forEach((z, rowIdx) => {
      for (let c = 0; c < cols; c++) {
        const x = side * (7 + c * 2.6);
        layout.push({
          id: `RACK-${String(id).padStart(3, '0')}`,
          position: [x, 0, z],
          rotation: [0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0],
          model: MODELS[(id + rowIdx) % MODELS.length],
        });
        id += 1;
      }
    });
  });
  return layout;
}

export const RACK_LAYOUT = buildLayout();

export default function ServerRackField({ layout, quality }) {
  return (
    <group>
      {layout.map((rack) => (
        <ServerRack key={rack.id} rack={rack} quality={quality} />
      ))}
    </group>
  );
}
