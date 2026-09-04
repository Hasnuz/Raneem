import { ImageResponse } from "next/og";

export const alt = "Raneem Businessmen Services — Dubai, UAE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 82px", color: "white", background: "linear-gradient(135deg,#061d26 0%,#073843 68%,#b51226 150%)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}><div style={{ width: 76, height: 76, borderRadius: 38, display: "flex", alignItems: "center", justifyContent: "center", background: "#e51b36", fontSize: 28, fontWeight: 800 }}>RBS</div><div style={{ fontSize: 31, fontWeight: 700 }}>Raneem Businessmen Services</div></div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}><div style={{ color: "#efb348", fontSize: 22, letterSpacing: 5, fontWeight: 700 }}>DUBAI · UNITED ARAB EMIRATES</div><div style={{ marginTop: 22, fontSize: 64, lineHeight: 1.08, fontWeight: 800, letterSpacing: -2 }}>Business setup and PRO services, handled with clarity.</div></div>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1", fontSize: 23 }}><span>Company formation · Visas · Government services</span><span>raneembms.com</span></div>
    </div>,
    size,
  );
}
