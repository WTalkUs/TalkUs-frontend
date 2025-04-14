import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*", // URL pública sin "modules"
        destination: "/modules/auth/:path*", // Ruta real en el sistema de archivos
      },
    ];
  },
};

export default nextConfig;
