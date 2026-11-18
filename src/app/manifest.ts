import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ROHO TIPS",
    short_name: "ROHO TIPS",
    description: "Mikeka ya uhakika na betting tips kutoka ROHO TIPS Tanzania.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    categories: ["sports", "entertainment"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/roho_logo.jpg",
        sizes: "any",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
