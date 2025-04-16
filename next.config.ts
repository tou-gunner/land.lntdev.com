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
  webpack: (config) => {
    // Add support for loading PDF.js worker from node_modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': require.resolve('pdfjs-dist'),
    };
    return config;
  },
};

export default nextConfig;
