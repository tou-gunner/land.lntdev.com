import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'standalone',
  // output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  webpack: (config) => {
    // Add support for loading PDF.js worker from node_modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': require.resolve('pdfjs-dist'),
    };
    return config;
  },
  // Configure API routes
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        // destination: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      }
    ];
  },
};

export default nextConfig;
