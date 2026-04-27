import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.56.1", "localhost", "127.0.0.1"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
