/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.56.1", "localhost", "127.0.0.1"],
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
