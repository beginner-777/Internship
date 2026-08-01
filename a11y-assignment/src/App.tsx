import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// A simple rotating 3D shape component
function AnimatedShape() {
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshStandardMaterial color="#4f46e5" wireframe={true} />
    </mesh>
  );
}

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-8">
      {/* Navigation */}
      <nav className="flex justify-between items-center max-w-5xl mx-auto w-full">
        <h1 className="text-xl font-bold tracking-wider">PORTFOLIO</h1>
        <div className="space-x-6 text-sm text-slate-400">
          <a href="#projects" className="hover:text-white transition">Projects</a>
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>
      </nav>

      {/* Hero Section with 3D Canvas */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-auto py-12">
        <div className="space-y-4">
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">Software Engineering Undergraduate</span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Building modern web experiences.</h2>
          <p className="text-slate-400">
            Hi, I'm Musfirah. I build functional web applications, interactive interfaces, and live digital projects.
          </p>
          <div className="pt-4 flex gap-4">
            <a href="#projects" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition inline-block">
              Explore Work
            </a>
          </div>
        </div>

        {/* 3D Animation Canvas */}
        <div className="h-[350px] w-full cursor-grab active:cursor-grabbing">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <AnimatedShape />
            <OrbitControls enableZoom={false} autoRotate />
          </Canvas>
        </div>
      </div>

      {/* Projects Section */}
      <section id="projects" className="max-w-5xl mx-auto w-full py-16 border-t border-slate-800">
        <h3 className="text-2xl font-bold mb-8 text-indigo-400">Featured Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Project 1 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3 hover:border-indigo-500 transition">
            <h4 className="text-xl font-semibold">Luxury Automotive Showcase</h4>
            <p className="text-slate-400 text-sm">
              A dynamic luxury automotive web application showcase featuring sleek UI components, interactive views, and responsive layouts deployed live via Vercel.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-slate-800 text-indigo-300 text-xs px-2.5 py-1 rounded-md mr-2">Frontend</span>
              <span className="inline-block bg-slate-800 text-indigo-300 text-xs px-2.5 py-1 rounded-md">Vercel Live</span>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3 hover:border-indigo-500 transition">
            <h4 className="text-xl font-semibold">Smart Expense Tracker</h4>
            <p className="text-slate-400 text-sm">
              A functional Python Flask application running locally inside a virtual environment to track daily expenses, manage budgets, and handle backend routes cleanly.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-slate-800 text-emerald-300 text-xs px-2.5 py-1 rounded-md mr-2">Python Flask</span>
              <span className="inline-block bg-slate-800 text-emerald-300 text-xs px-2.5 py-1 rounded-md">Local Server</span>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 max-w-5xl mx-auto w-full pt-8 border-t border-slate-900">
        Live on Vercel • Built with React, Vite & Three.js
      </footer>
    </main>
  );
}