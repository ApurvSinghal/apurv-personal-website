import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/projects";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type OpenGraphImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  const title = project?.title ?? "Project Case Study";
  const summary = project?.summary ?? "Software engineering case study";

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
        <div
          style={{
            fontSize: 28,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#7d4d15",
          }}
        >
          Apurv Singhal | Case Study
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 62, lineHeight: 1.06, fontWeight: 700, maxWidth: 1000 }}>{title}</div>
          <div style={{ fontSize: 30, lineHeight: 1.35, maxWidth: 980, color: "#4b4b4b" }}>{summary}</div>
        </div>

        <div style={{ fontSize: 24, color: "#5a5a5a" }}>apurvsinghal.com/projects/{slug}</div>
      </div>
    ),
    {
      ...size,
    },
  );
}
