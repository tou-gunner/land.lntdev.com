import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://mcconsultancy.la:9092/:path*',
      },
    ];
  },
};

export default nextConfig;
