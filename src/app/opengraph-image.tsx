import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at 85% 20%, #f4d9b5 0, #f8eee0 35%, #f5f2ea 55%, #ece9e0 100%)",
          color: "#1d1d1d",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, textTransform: "uppercase", color: "#7d4d15" }}>
          Software Engineer Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 70, lineHeight: 1.04, fontWeight: 700, maxWidth: 1000 }}>
            Apurv Singhal
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.35, maxWidth: 980, color: "#4b4b4b" }}>
            Building reliable products with cloud architecture, backend systems, and observability.
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#5a5a5a" }}>apurvsinghal.com</div>
      </div>
    ),
    {
      ...size,
    },
  );
}
