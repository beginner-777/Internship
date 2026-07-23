import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex gap-6 p-4 bg-slate-800 text-white border-b border-slate-700">
      <Link href="/" className="hover:text-blue-400 font-semibold">Home</Link>
      <Link href="/garage" className="hover:text-blue-400 font-semibold">Garage</Link>
      <Link href="/mechanics" className="hover:text-blue-400 font-semibold">Mechanics</Link>
      <Link href="/specs-dex" className="hover:text-blue-400 font-semibold">Specs-Dex</Link>
      <Link href="/community" className="hover:text-blue-400 font-semibold">Community</Link>
    </nav>
  );
}