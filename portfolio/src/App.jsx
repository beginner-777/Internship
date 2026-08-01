import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import { Github, Linkedin, Mail, ArrowRight, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: 'Luxury Automotive Showcase',
    description:
      'A dynamic automotive showcase featuring sleek UI components, interactive views, and responsive layouts — deployed live via Vercel.',
    tags: ['React', 'Tailwind CSS', 'Vercel'],
    link: '#',
  },
  {
    title: 'Smart Expense Tracker',
    description:
      'A Python Flask application running inside a virtual environment to track daily expenses, manage budgets, and handle backend routes cleanly.',
    tags: ['Python', 'Flask', 'SQLite'],
    link: '#',
  },
];

const skills = ['React', 'JavaScript / TypeScript', 'Python · Flask', 'Tailwind CSS', 'Three.js', 'Git & GitHub'];

function Navbar() {
  const links = [
    { href: '#projects', label: 'Projects' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="font-display text-lg font-semibold tracking-tight text-white">
          Musfirah<span className="text-accent-light">.</span>
        </a>
        <ul className="flex items-center gap-8 text-sm text-slate-400">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function HeroShape() {
  return (
    <Float speed={1.6} rotationIntensity={1.1} floatIntensity={1.4}>
      <mesh rotation={[0.4, 0.6, 0]}>
        <icosahedronGeometry args={[1.5, 1]} />
        <MeshDistortMaterial
          color="#6366F1"
          emissive="#312E81"
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.6}
          distort={0.35}
          speed={2}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen pt-28 md:pt-0 flex items-center overflow-hidden">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
        <div className="space-y-6">
          <span className="inline-block text-accent-light text-sm font-semibold tracking-widest uppercase">
            Software Engineering Undergraduate
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-white">
            Building modern web experiences.
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            Hi, I'm Musfirah. I build functional web applications, interactive
            interfaces, and live digital projects — from front-end polish to the
            backend routes that hold it all together.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Explore work <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-200 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="h-[380px] md:h-[480px] w-full cursor-grab active:cursor-grabbing">
          <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[4, 4, 4]} intensity={1.2} />
              <pointLight position={[-4, -2, -2]} color="#818CF8" intensity={1.2} />
              <Stars radius={40} depth={30} count={800} factor={2} saturation={0} fade speed={0.6} />
              <HeroShape />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={1.4}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <a
      href={project.link}
      className="group relative bg-slate-900 border border-slate-800 hover:border-accent/50 p-6 rounded-2xl space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold text-white font-display">{project.title}</h3>
        <ArrowUpRight
          size={20}
          className="text-slate-600 group-hover:text-accent-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
        />
      </div>
      <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2 pt-1">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-accent-light font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}

function Projects() {
  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-900">
      <span className="text-accent-light text-sm font-semibold tracking-widest uppercase">Selected work</span>
      <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-12 text-white">Featured projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-900">
      <span className="text-accent-light text-sm font-semibold tracking-widest uppercase">About</span>
      <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-6 text-white">A little about me</h2>
      <p className="text-slate-400 max-w-2xl leading-relaxed">
        I'm a software engineering undergraduate who enjoys turning rough ideas
        into working products — from responsive front ends to the backend
        routes and data that power them. I care about interfaces that feel
        fast, clear, and considered.
      </p>
      <div className="flex flex-wrap gap-2 pt-6">
        {skills.map((skill) => (
          <span
            key={skill}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-800 text-slate-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-900">
      <span className="text-accent-light text-sm font-semibold tracking-widest uppercase">Contact</span>
      <h2 className="font-display text-3xl md:text-5xl font-bold mt-3 mb-6 text-white">
        Let's build something together.
      </h2>
      <a
        href="mailto:hello@musfirah.dev"
        className="inline-flex items-center gap-2 text-lg text-accent-light hover:text-white transition-colors mb-8"
      >
        <Mail size={18} /> hello@musfirah.dev
      </a>
      <div className="flex gap-5 text-slate-400">
        <a href="#" aria-label="GitHub" className="hover:text-white transition-colors">
          <Github size={20} />
        </a>
        <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors">
          <Linkedin size={20} />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center text-xs text-slate-600">
        Built with React, Vite, Tailwind CSS &amp; React Three Fiber.
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main className="bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
