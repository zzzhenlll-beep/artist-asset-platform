import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/api/media/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/api/media/**" },
    ],
  },
};

export default nextConfig;
