import Link from "next/link";
import { ArrowLeft, ScanSearch } from "lucide-react";

export default function NotFound() {
  return <main className="not-found-page"><div className="not-found-orbit"><i /><i /><span>404</span></div><span>UNKNOWN SIGNAL</span><h1>This route is outside<br />the neural map.</h1><p>The page may have moved, or the address may be incomplete. Return to the audit engine and start from a verified path.</p><div><Link href="/audit" className="button"><ScanSearch /> START AUDIT</Link><Link href="/" className="text-button"><ArrowLeft /> RETURN HOME</Link></div></main>;
}
