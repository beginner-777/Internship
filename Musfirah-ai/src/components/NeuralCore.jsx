import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

const keyRows = [12, 11, 10, 9];

function roundedRect(context, x, y, width, height, radius, fill, stroke) {
  const corner = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + corner, y);
  context.lineTo(x + width - corner, y);
  context.quadraticCurveTo(x + width, y, x + width, y + corner);
  context.lineTo(x + width, y + height - corner);
  context.quadraticCurveTo(x + width, y + height, x + width - corner, y + height);
  context.lineTo(x + corner, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - corner);
  context.lineTo(x, y + corner);
  context.quadraticCurveTo(x, y, x + corner, y);
  context.closePath();
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (stroke) {
    context.strokeStyle = stroke;
    context.stroke();
  }
}

function createFrontendWorkspaceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const context = canvas.getContext('2d');

  const background = context.createLinearGradient(0, 0, 1600, 1000);
  background.addColorStop(0, '#0B1220');
  background.addColorStop(0.58, '#101827');
  background.addColorStop(1, '#16202E');
  context.fillStyle = background;
  context.fillRect(0, 0, 1600, 1000);

  context.fillStyle = '#16202E';
  context.fillRect(0, 0, 1600, 78);
  ['#ff806f', '#f3c969', '#6ee7b7'].forEach((color, index) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(34 + index * 28, 39, 8, 0, Math.PI * 2);
    context.fill();
  });
  context.fillStyle = '#F4F1EA';
  context.font = '600 18px monospace';
  context.fillText('M/AI · FRONTEND WORKSTATION', 145, 46);
  context.fillStyle = '#C89B5B';
  context.fillText('● LIVE', 1480, 46);

  context.fillStyle = '#0B1220';
  context.fillRect(0, 78, 235, 872);
  context.strokeStyle = 'rgba(255,255,255,.07)';
  context.beginPath();
  context.moveTo(235, 78);
  context.lineTo(235, 950);
  context.stroke();
  context.fillStyle = '#8993A4';
  context.font = '14px monospace';
  context.fillText('EXPLORER', 28, 120);
  const files = [
    ['▾', 'src'],
    ['  ◇', 'components'],
    ['    ⚛', 'Experience.jsx'],
    ['    #', 'interface.css'],
    ['  ◇', 'hooks'],
    ['  ◇', 'data'],
    ['▸', 'public'],
  ];
  files.forEach(([icon, name], index) => {
    const y = 174 + index * 50;
    if (index === 2) roundedRect(context, 12, y - 28, 210, 40, 7, 'rgba(137,150,200,.2)');
    context.fillStyle = index === 2 ? '#F4F1EA' : '#8993A4';
    context.font = '16px monospace';
    context.fillText(`${icon}  ${name}`, 26, y);
  });
  context.fillStyle = '#67758A';
  context.font = '12px monospace';
  context.fillText('OUTLINE', 28, 590);
  context.fillText('TIMELINE', 28, 640);

  context.fillStyle = '#16202E';
  context.fillRect(235, 78, 690, 70);
  roundedRect(context, 252, 92, 230, 45, 8, '#28384A');
  context.fillStyle = '#F4F1EA';
  context.font = '15px monospace';
  context.fillText('⚛  Experience.jsx  ×', 272, 120);
  context.fillStyle = '#8993A4';
  context.fillText('#  interface.css', 520, 120);

  const code = [
    ['01', 'const', ' craftExperience ', '= () => {'],
    ['02', '  return', ' ('],
    ['03', '    <Interface'],
    ['04', '      responsive', '= {true}'],
    ['05', '      accessible', '= {true}'],
    ['06', '      motion', '= "purposeful"'],
    ['07', '      intelligence', '= "human-first"'],
    ['08', '    />'],
    ['09', '  );'],
    ['10', '};'],
    ['11', ''],
    ['12', 'export default', ' craftExperience;'],
  ];
  context.font = '22px monospace';
  code.forEach(([number, keyword, rest], index) => {
    const y = 205 + index * 54;
    context.fillStyle = '#67758A';
    context.fillText(number, 270, y);
    context.fillStyle = keyword.includes('<') || keyword.includes('/>') ? '#8996C8' : '#F4F1EA';
    context.fillText(keyword, 325, y);
    context.fillStyle = rest?.includes('true') ? '#C89B5B' : '#C4C8D1';
    context.fillText(rest || '', 325 + context.measureText(keyword).width, y);
  });

  context.strokeStyle = 'rgba(255,255,255,.07)';
  context.beginPath();
  context.moveTo(925, 78);
  context.lineTo(925, 950);
  context.stroke();
  context.fillStyle = '#101827';
  context.fillRect(925, 78, 675, 70);
  context.fillStyle = '#8993A4';
  context.font = '14px monospace';
  context.fillText('PREVIEW  /  1440 × 900', 965, 120);
  context.fillStyle = '#8996C8';
  context.fillText('DESKTOP  TABLET  MOBILE', 1280, 120);

  roundedRect(context, 968, 185, 585, 590, 24, '#0B1220', 'rgba(137,150,200,.28)');
  context.fillStyle = '#16202E';
  context.fillRect(968, 185, 585, 58);
  context.fillStyle = '#8993A4';
  context.font = '13px monospace';
  context.fillText('musfirah.dev / experience', 1035, 221);
  context.fillStyle = '#F4F1EA';
  context.font = '700 19px sans-serif';
  context.fillText('MUSFIRAH / LAB', 1002, 289);
  context.fillStyle = '#8993A4';
  context.font = '12px sans-serif';
  context.fillText('WORK   SYSTEMS   CONTACT', 1335, 289);

  context.fillStyle = '#F4F1EA';
  context.font = '700 48px sans-serif';
  context.fillText('Interfaces that', 1002, 385);
  context.fillStyle = '#C89B5B';
  context.font = 'italic 54px Georgia';
  context.fillText('feel effortless.', 1002, 447);
  context.fillStyle = '#8993A4';
  context.font = '17px sans-serif';
  context.fillText('Engineering expressive, accessible products', 1002, 500);
  context.fillText('where frontend craft meets intelligence.', 1002, 529);
  roundedRect(context, 1002, 575, 205, 58, 12, '#C89B5B');
  context.fillStyle = '#0B1220';
  context.font = '600 15px sans-serif';
  context.fillText('Explore systems  ↗', 1032, 611);
  roundedRect(context, 1235, 558, 276, 132, 18, '#16202E');
  context.fillStyle = '#8996C8';
  context.font = '12px monospace';
  context.fillText('COMPONENT SIGNAL', 1260, 590);
  context.fillStyle = '#F4F1EA';
  context.font = '700 21px sans-serif';
  context.fillText('Responsive by design', 1260, 630);
  context.fillStyle = '#8993A4';
  context.font = '13px sans-serif';
  context.fillText('React · Motion · AI', 1260, 662);

  const audits = [
    ['PERFORMANCE', '98'],
    ['ACCESSIBILITY', '100'],
    ['RESPONSIVE', '✓'],
  ];
  audits.forEach(([label, value], index) => {
    const x = 968 + index * 195;
    roundedRect(context, x, 810, 175, 92, 14, 'rgba(137,150,200,.08)', 'rgba(137,150,200,.2)');
    context.fillStyle = '#8993A4';
    context.font = '11px monospace';
    context.fillText(label, x + 18, 842);
    context.fillStyle = '#C89B5B';
    context.font = '700 26px sans-serif';
    context.fillText(value, x + 18, 881);
  });

  context.fillStyle = '#101827';
  context.fillRect(0, 950, 1600, 50);
  context.fillStyle = '#8996C8';
  context.font = '13px monospace';
  context.fillText('◉ MAIN  ✓ COMPILED', 28, 981);
  context.fillStyle = '#8993A4';
  context.fillText('REACT 19   TAILWIND   MOTION   UTF-8   PRETTIER', 1050, 981);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function Keyboard() {
  return (
    <group>
      {keyRows.flatMap((length, row) => (
        Array.from({ length }, (_, column) => {
          const offset = (12 - length) * 0.16;
          return (
            <mesh key={`${row}-${column}`} position={[-1.92 + column * 0.35 + offset, -1.08, -0.48 + row * 0.34]}>
              <boxGeometry args={[0.28, 0.065, 0.23]} />
              <meshStandardMaterial color="#0B1220" metalness={0.46} roughness={0.4} />
            </mesh>
          );
        })
      ))}
      <mesh position={[0, -1.075, 0.93]}>
        <boxGeometry args={[1.62, 0.065, 0.22]} />
        <meshStandardMaterial color="#101827" metalness={0.44} roughness={0.4} />
      </mesh>
    </group>
  );
}

function ResponsiveDevice() {
  return (
    <group position={[3.25, -0.05, -0.15]} rotation={[0.04, -0.3, -0.03]}>
      <mesh>
        <boxGeometry args={[0.78, 1.46, 0.08]} />
        <meshStandardMaterial color="#16202E" metalness={0.78} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.046]}>
        <planeGeometry args={[0.68, 1.3]} />
        <meshBasicMaterial color="#0B1220" />
      </mesh>
      <mesh position={[0, 0.42, 0.052]}>
        <planeGeometry args={[0.48, 0.12]} />
        <meshBasicMaterial color="#8996C8" transparent opacity={0.88} />
      </mesh>
      {[0.12, -0.1, -0.32].map((y, index) => (
        <mesh key={y} position={[index === 1 ? 0.08 : -0.05, y, 0.052]}>
          <planeGeometry args={[index === 1 ? 0.38 : 0.5, 0.1]} />
          <meshBasicMaterial color={index === 1 ? '#C89B5B' : '#8993A4'} transparent opacity={0.78} />
        </mesh>
      ))}
    </group>
  );
}

function FrontendLaptop() {
  const group = useRef();
  const statusLight = useRef();
  const reducedMotion = useReducedMotion();
  const screenTexture = useMemo(() => createFrontendWorkspaceTexture(), []);

  useEffect(() => () => screenTexture.dispose(), [screenTexture]);

  useFrame((state) => {
    if (!group.current) return;
    if (!reducedMotion) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -0.08 + state.pointer.x * 0.075, 0.035);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -0.02 - state.pointer.y * 0.035, 0.035);
    }
    if (statusLight.current) {
      statusLight.current.material.emissiveIntensity = 1.35 + Math.sin(state.clock.elapsedTime * 2.4) * 0.45;
    }
  });

  return (
    <group ref={group} rotation={[-0.02, -0.08, 0]} scale={0.82} position={[-0.12, -0.28, 0]}>
      <Float speed={reducedMotion ? 0 : 0.7} rotationIntensity={0.018} floatIntensity={0.07}>
        <group>
          <mesh position={[0, 0.46, -1.02]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[5.2, 3.22, 0.15]} />
            <meshStandardMaterial color="#16202E" metalness={0.86} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.46, -0.93]} rotation={[-0.1, 0, 0]}>
            <planeGeometry args={[4.82, 2.84]} />
            <meshBasicMaterial map={screenTexture} toneMapped={false} />
          </mesh>
          <mesh position={[0, -1.22, 0.17]}>
            <boxGeometry args={[5.48, 0.2, 2.94]} />
            <meshStandardMaterial color="#28384A" metalness={0.88} roughness={0.2} />
          </mesh>
          <mesh position={[0, -1.105, 0.17]}>
            <boxGeometry args={[5.18, 0.04, 2.64]} />
            <meshStandardMaterial color="#0B1220" metalness={0.5} roughness={0.46} />
          </mesh>
          <Keyboard />
          <mesh position={[0, -1.055, 1.25]}>
            <boxGeometry args={[1.62, 0.03, 0.56]} />
            <meshStandardMaterial color="#28384A" metalness={0.62} roughness={0.3} />
          </mesh>
          <mesh position={[0, -1.14, -1.12]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 3.85, 28]} />
            <meshStandardMaterial color="#3C4B5E" metalness={0.93} roughness={0.15} />
          </mesh>
          <mesh position={[0, -1.33, 1.64]}>
            <boxGeometry args={[4.76, 0.035, 0.055]} />
            <meshBasicMaterial color="#8996C8" transparent opacity={0.78} />
          </mesh>
          <mesh ref={statusLight} position={[2.4, -1.33, 1.45]}>
            <sphereGeometry args={[0.035, 18, 18]} />
            <meshStandardMaterial color="#C89B5B" emissive="#C89B5B" emissiveIntensity={1.5} />
          </mesh>
          <ResponsiveDevice />
        </group>
      </Float>
      <Sparkles count={16} scale={[7.4, 4.8, 3]} size={1.05} speed={reducedMotion ? 0 : 0.14} opacity={0.26} color="#8996C8" />
    </group>
  );
}

function StaticWorkstation() {
  const keys = Array.from({ length: 30 }, (_, index) => <span key={index} />);
  return (
    <div className="static-workstation static-workstation-frontend" role="img" aria-label="Frontend engineering laptop visualization">
      <div className="static-laptop-screen">
        <small>FRONTEND WORKSTATION · LIVE</small>
        <strong>&lt;Interface responsive accessible /&gt;</strong>
        <span /><span /><span />
      </div>
      <div className="static-laptop-base">
        <div className="static-key-grid">{keys}</div>
        <i />
      </div>
    </div>
  );
}

class WorkstationErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <StaticWorkstation /> : this.props.children;
  }
}

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function NeuralCore() {
  const [webGLAvailable] = useState(detectWebGL);

  return (
    <div className="neural-core engineering-workstation" aria-label="Interactive frontend engineering workstation">
      <div className="workstation-halo" aria-hidden="true" />
      <WorkstationErrorBoundary>
        {webGLAvailable ? (
          <Canvas
            style={{ position: 'absolute', inset: 0 }}
            camera={{ position: [0, 2.35, 7.8], fov: 38 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ camera }) => camera.lookAt(0, -0.35, 0)}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.72} />
              <pointLight position={[4, 5, 5]} color="#F4F1EA" intensity={20} distance={11} />
              <pointLight position={[-4, 0, 3]} color="#8996C8" intensity={18} distance={9} />
              <pointLight position={[1, -2, 4]} color="#C89B5B" intensity={8} distance={7} />
              <FrontendLaptop />
            </Suspense>
          </Canvas>
        ) : <StaticWorkstation />}
      </WorkstationErrorBoundary>
      <div className="workstation-caption workstation-caption-pro">
        <span>FRONTEND WORKSTATION</span><i /> DESIGN · CODE · SHIP
      </div>
    </div>
  );
}
