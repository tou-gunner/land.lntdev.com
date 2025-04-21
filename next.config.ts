import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  async rewrites() {
    // Use the environment variable for API URL, or fallback to default if not set
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://mcconsultancy.la:9092';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
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
