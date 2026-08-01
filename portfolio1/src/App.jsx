import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Download,
  Mail,
  Github,
  Linkedin,
  ArrowUpRight,
  Code2,
  Palette,
  GitBranch,
  Boxes,
} from 'lucide-react';

const projects = [
  {
    title: 'Luxury Automotive Showcase',
    description:
      'A dynamic automotive showcase featuring sleek UI components, interactive views, and responsive layouts — deployed live via Vercel.',
    tags: ['React', 'Tailwind CSS', 'Vercel'],
  },
  {
    title: 'Smart Expense Tracker',
    description:
      'A Python Flask application running inside a virtual environment to track daily expenses, manage budgets, and handle backend routes cleanly.',
    tags: ['Python', 'Flask', 'SQLite'],
  },
];

const skills = ['React', 'JavaScript / TypeScript', 'Python · Flask', 'Tailwind CSS', 'Three.js', 'Git & GitHub'];

const lerp = (a, b, t) => a + (b - a) * t;

// ---------------------------------------------------------------------------
// Navbar — a single rounded dark bar like the reference: logo, centered
// links, "Download Resume" action on the right.
// ---------------------------------------------------------------------------
function Navbar() {
  const links = [
    { href: '#home', label: 'Home' },
    { href: '#projects', label: 'Work' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Connect' },
  ];
  return (
    <header className="fixed top-5 inset-x-0 z-50 px-4">
      <nav className="max-w-4xl mx-auto flex items-center justify-between gap-4 rounded-2xl border border-ink-line bg-ink-card/80 backdrop-blur-md px-5 py-3">
        <a href="#home" className="font-display text-lg font-semibold tracking-tight text-white">
          musfirah<span className="text-accent">.</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={i === 0 ? 'text-accent font-medium' : 'text-slate-400 hover:text-white transition-colors'}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-xs font-medium rounded-xl border border-ink-line px-3 py-2 text-slate-200 hover:border-accent/60 hover:text-white transition-colors"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Resume</span>
        </a>
      </nav>
    </header>
  );
}

// ---------------------------------------------------------------------------
// 3D character — a stylized, low-poly hijabi avatar holding a phone, built
// from primitives. Head gently tracks the cursor; the whole figure idles
// with a slow breathing float.
// ---------------------------------------------------------------------------
function Character({ mountRef }) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.25, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const setSize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    setSize();

    scene.add(new THREE.AmbientLight(0xffdcc2, 0.55));
    const key = new THREE.DirectionalLight(0xff8a4c, 1.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9c8fe0, 0.5);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    const skin = new THREE.MeshStandardMaterial({ color: '#B98156', roughness: 0.5 });
    const hijab = new THREE.MeshStandardMaterial({ color: '#E8622C', roughness: 0.55 });
    const hijabDeep = new THREE.MeshStandardMaterial({ color: '#C94F20', roughness: 0.55 });
    const jacket = new THREE.MeshStandardMaterial({ color: '#3A2A22', roughness: 0.5 });
    const dark = new THREE.MeshStandardMaterial({ color: '#241813', roughness: 0.4 });
    const spark = new THREE.MeshBasicMaterial({ color: '#FFF3E4' });
    const screen = new THREE.MeshBasicMaterial({ color: '#FFB37A' });

    const avatar = new THREE.Group();
    const addTo = (parent, geo, mat, pos, rot, scale) => {
      const m = new THREE.Mesh(geo, mat);
      if (pos) m.position.set(...pos);
      if (rot) m.rotation.set(...rot);
      if (scale) m.scale.set(...scale);
      parent.add(m);
      return m;
    };

    addTo(avatar, new THREE.CylinderGeometry(0.5, 0.62, 1.3, 20), jacket, [0, 0.35, 0]);
    addTo(avatar, new THREE.CylinderGeometry(0.3, 0.8, 1.0, 20), hijabDeep, [0, 0.95, 0]);
    addTo(avatar, new THREE.CylinderGeometry(0.14, 0.16, 0.22, 16), skin, [0, 1.12, 0]);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.56, 0);
    avatar.add(headGroup);

    addTo(headGroup, new THREE.SphereGeometry(0.48, 32, 24), skin, [0, 0, 0]);
    addTo(headGroup, new THREE.SphereGeometry(0.53, 32, 24), hijab, [0, 0.01, -0.02]);
    addTo(headGroup, new THREE.SphereGeometry(0.4, 32, 24), skin, [0, 0, 0.34], null, [1, 1.12, 0.55]);

    const eyeL = addTo(headGroup, new THREE.SphereGeometry(0.05, 16, 16), dark, [-0.14, 0.05, 0.56]);
    const eyeR = addTo(headGroup, new THREE.SphereGeometry(0.05, 16, 16), dark, [0.14, 0.05, 0.56]);
    addTo(headGroup, new THREE.SphereGeometry(0.014, 8, 8), spark, [-0.115, 0.075, 0.6]);
    addTo(headGroup, new THREE.SphereGeometry(0.014, 8, 8), spark, [0.165, 0.075, 0.6]);
    addTo(headGroup, new THREE.BoxGeometry(0.12, 0.02, 0.02), dark, [-0.14, 0.16, 0.55], [0, 0, 0.08]);
    addTo(headGroup, new THREE.BoxGeometry(0.12, 0.02, 0.02), dark, [0.14, 0.16, 0.55], [0, 0, -0.08]);
    addTo(headGroup, new THREE.ConeGeometry(0.035, 0.09, 10), skin, [0, -0.06, 0.58], [Math.PI * 0.55, 0, 0]);
    const smile = addTo(headGroup, new THREE.TorusGeometry(0.09, 0.016, 10, 20, Math.PI), dark, [0, -0.08, 0.55]);
    smile.rotation.x = Math.PI;
    smile.rotation.z = Math.PI;

    // left arm — bent, holding a phone up
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-0.5, 1.15, 0.1);
    addTo(leftPivot, new THREE.CylinderGeometry(0.08, 0.07, 0.5, 14), jacket, [0, -0.24, 0.05], [0.5, 0, 0]);
    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.5, 0.28);
    addTo(handGroup, new THREE.SphereGeometry(0.09, 14, 14), skin, [0, 0, 0]);
    addTo(handGroup, new THREE.BoxGeometry(0.18, 0.34, 0.03), dark, [0, 0.2, 0.05], [0.15, 0, 0]);
    addTo(handGroup, new THREE.BoxGeometry(0.14, 0.26, 0.01), screen, [0, 0.2, 0.07], [0.15, 0, 0]);
    leftPivot.add(handGroup);
    leftPivot.rotation.z = 0.5;
    avatar.add(leftPivot);

    // right arm — relaxed
    const rightArm = new THREE.Group();
    rightArm.position.set(0.52, 1.05, 0.05);
    rightArm.rotation.z = -0.3;
    addTo(rightArm, new THREE.CylinderGeometry(0.08, 0.07, 0.58, 14), jacket, [0, -0.29, 0]);
    addTo(rightArm, new THREE.SphereGeometry(0.09, 14, 14), skin, [0, -0.58, 0]);
    avatar.add(rightArm);

    const scarfGeo = new THREE.PlaneGeometry(0.32, 0.9, 1, 14);
    const scarfOriginal = Float32Array.from(scarfGeo.attributes.position.array);
    const scarf = new THREE.Mesh(
      scarfGeo,
      new THREE.MeshStandardMaterial({ color: '#C94F20', roughness: 0.55, side: THREE.DoubleSide })
    );
    scarf.position.set(0.5, 0.85, -0.28);
    scarf.rotation.y = -0.5;
    scarf.rotation.z = -0.15;
    avatar.add(scarf);

    avatar.scale.set(1, 1, 1);
    avatar.position.set(0, -1.05, 0);
    scene.add(avatar);

    let mouseX = 0;
    let mouseY = 0;
    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove);

    let raf;
    let autoAngle = 0;
    let headYaw = 0;
    let headPitch = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      autoAngle += 0.001;
      avatar.rotation.y = autoAngle + mouseX * 0.1;
      avatar.position.y = -1.05 + Math.sin(t * 1.1) * 0.06;

      headYaw = lerp(headYaw, mouseX * 0.45, 0.06);
      headPitch = lerp(headPitch, -mouseY * 0.2, 0.06);
      headGroup.rotation.y = headYaw;
      headGroup.rotation.x = headPitch;

      const blink = (t % 4) > 3.85 ? 0.15 : 1;
      eyeL.scale.y = blink;
      eyeR.scale.y = blink;

      const posAttr = scarf.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const ox = scarfOriginal[i * 3];
        const oy = scarfOriginal[i * 3 + 1];
        const oz = scarfOriginal[i * 3 + 2];
        const sway = Math.sin(t * 2.1 + oy * 3) * 0.05 * (1 - (oy + 0.45));
        posAttr.setXYZ(i, ox - sway, oy, oz - sway * 0.6);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [mountRef]);

  return null;
}

// small floating badge representing a skill area
function FloatBadge({ icon, className, delay, bg }) {
  return (
    <div
      className={`absolute w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-black/40 animate-floaty ${className}`}
      style={{ background: bg, animationDelay: delay }}
    >
      {icon}
    </div>
  );
}

function LightningGraphic() {
  return (
    <svg
      className="absolute -right-10 -top-6 w-40 h-64 opacity-90 pointer-events-none select-none -z-10"
      viewBox="0 0 120 200"
      fill="none"
    >
      <defs>
        <linearGradient id="bolt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9457" />
          <stop offset="100%" stopColor="#B3260E" />
        </linearGradient>
      </defs>
      <polygon points="70,0 20,110 55,110 40,200 100,80 62,80" fill="url(#bolt)" />
    </svg>
  );
}

function Hero() {
  const canvasMount = useRef(null);
  return (
    <section id="home" className="relative pt-40 pb-32 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto relative rounded-[2rem] border border-ink-line bg-gradient-to-b from-ink-card to-ink px-6 md:px-12 py-16 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-slate-300 text-lg">
              Hey, I am <span className="text-accent font-semibold">Musfirah</span>
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-white mt-2 mb-6">
              Software developer
            </h1>
            <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
              I build functional web applications and interactive interfaces —
              from polished React front ends to the Python backends that keep
              them running.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Hire me
              </a>
              <a
                href="mailto:hello@musfirah.dev"
                aria-label="Email"
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-ink-line text-slate-200 hover:border-accent/60 hover:text-white transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="relative h-[420px] flex items-center justify-center">
            <div className="absolute w-80 h-80 rounded-full border border-dashed border-white/10" />
            <div className="absolute w-96 h-96 rounded-full border border-dashed border-white/5" />
            <LightningGraphic />

            <FloatBadge
              icon={<Code2 size={22} className="text-white" />}
              bg="linear-gradient(135deg,#F7DF1E,#B08900)"
              className="top-2 left-2"
              delay="0s"
            />
            <FloatBadge
              icon={<Boxes size={22} className="text-white" />}
              bg="linear-gradient(135deg,#61DAFB,#1B7A94)"
              className="top-6 right-0"
              delay="0.6s"
            />
            <FloatBadge
              icon={<Palette size={22} className="text-white" />}
              bg="linear-gradient(135deg,#2965F1,#1A3E8C)"
              className="bottom-16 left-0"
              delay="1.1s"
            />
            <FloatBadge
              icon={<GitBranch size={22} className="text-white" />}
              bg="linear-gradient(135deg,#F1502F,#8C2916)"
              className="bottom-4 right-4"
              delay="1.6s"
            />

            <div className="w-72 h-96 cursor-grab active:cursor-grabbing" ref={canvasMount} />
            <Character mountRef={canvasMount} />
          </div>
        </div>

        {/* testimonial card, overlapping the bottom-left edge of the hero */}
        <div className="absolute -bottom-8 left-6 md:left-10 max-w-xs rounded-2xl border border-ink-line bg-ink-card/95 backdrop-blur-md p-5 shadow-xl shadow-black/40 hidden sm:block">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            "Musfirah shipped our dashboard redesign ahead of schedule —
            thoughtful, fast, and easy to work with."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-semibold">
              SM
            </div>
            <div>
              <p className="text-sm text-white font-medium leading-none">Sara Malik</p>
              <p className="text-xs text-slate-500 mt-1">Product Lead</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="group relative bg-ink-card border border-ink-line hover:border-accent/50 p-6 rounded-2xl space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold text-white font-display">{project.title}</h3>
        <ArrowUpRight
          size={20}
          className="text-slate-600 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
        />
      </div>
      <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2 pt-1">
        {project.tags.map((tag) => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-accent-light font-medium">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-24">
      <span className="text-accent text-sm font-semibold tracking-widest uppercase">Selected work</span>
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
    <section id="about" className="max-w-6xl mx-auto px-6 py-24 border-t border-ink-line">
      <span className="text-accent text-sm font-semibold tracking-widest uppercase">About</span>
      <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-6 text-white">A little about me</h2>
      <p className="text-slate-400 max-w-2xl leading-relaxed">
        I'm a software engineering undergraduate who enjoys turning rough ideas
        into working products — from responsive front ends to the backend
        routes and data that power them. I care about interfaces that feel
        fast, clear, and considered.
      </p>
      <div className="flex flex-wrap gap-2 pt-6">
        {skills.map((skill) => (
          <span key={skill} className="text-xs px-3 py-1.5 rounded-full border border-ink-line text-slate-300">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 py-24 border-t border-ink-line">
      <span className="text-accent text-sm font-semibold tracking-widest uppercase">Contact</span>
      <h2 className="font-display text-3xl md:text-5xl font-bold mt-3 mb-6 text-white">
        Let's build something together.
      </h2>
      <a
        href="mailto:hello@musfirah.dev"
        className="inline-flex items-center gap-2 text-lg text-accent hover:text-white transition-colors mb-8"
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
    <footer className="border-t border-ink-line">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center text-xs text-slate-600">
        Built with React, Vite, Tailwind CSS &amp; Three.js.
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main className="bg-ink text-white">
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
