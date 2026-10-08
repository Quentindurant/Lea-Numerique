import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Léa Numérique – Intégrateur IT à Angers : téléphonie IP, réseaux, informatique, cybersécurité";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const mascotte = await readFile(join(process.cwd(), "public/images/mascotte.png"));
  const mascotteSrc = `data:image/png;base64,${mascotte.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 90px",
          background: "linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
          <div style={{ fontSize: 30, color: "#7C6EFA", marginBottom: 24 }}>Intégrateur IT à Angers (49)</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, marginBottom: 32 }}>Léa Numérique</div>
          <div style={{ fontSize: 36, color: "rgba(255,255,255,0.8)", lineHeight: 1.35 }}>
            Téléphonie IP, réseaux, informatique et cybersécurité pour les professionnels
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", marginTop: 36 }}>lea-numerique.fr · 02 19 23 06 91</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mascotteSrc} width={300} height={351} alt="" />
      </div>
    ),
    size,
  );
}
