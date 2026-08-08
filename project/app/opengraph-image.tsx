import { ImageResponse } from "next/og";

export const alt = "SYNAPSE SEO — See what search engines see";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#050507", color: "#F4F4F8", fontFamily: "Arial, sans-serif" }}>
    <div style={{ position: "absolute", width: 620, height: 620, borderRadius: 620, right: -40, top: 5, background: "radial-gradient(circle, rgba(185,140,255,.48), rgba(139,92,246,.14) 38%, transparent 68%)" }} />
    <div style={{ position: "absolute", width: 330, height: 330, border: "2px solid rgba(185,140,255,.55)", borderRadius: 330, right: 105, top: 150 }} />
    <div style={{ position: "absolute", width: 230, height: 230, border: "1px solid rgba(216,216,224,.45)", borderRadius: 230, right: 155, top: 200 }} />
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", letterSpacing: 12, fontSize: 28 }}>SYNAPSE <span style={{ color: "#B98CFF", fontSize: 15, letterSpacing: 18, marginTop: 8 }}>SEO</span></div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 700 }}><span style={{ color: "#B98CFF", fontSize: 15, letterSpacing: 5, marginBottom: 18 }}>AI-POWERED WEBSITE INTELLIGENCE</span><strong style={{ fontSize: 67, lineHeight: 1.02, letterSpacing: -3 }}>See what search<br />engines see.</strong><span style={{ color: "#A5A5B2", fontSize: 21, marginTop: 22 }}>Technical, content, and search performance—mapped into one living system.</span></div>
    </div>
  </div>, size);
}
