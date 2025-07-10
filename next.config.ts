import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  
  // Add these new configurations
  images: {
    domains: [
      '172.184.146.248.sslip.io',
      'q08c44c8ccwogwck8gwo8gco.172.184.146.248.sslip.io'
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "connect-src 'self' *.sslip.io",
              "img-src 'self' data: blob: *.sslip.io",
              "font-src 'self' *.sslip.io",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
            ].join('; ')
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*.sslip.io'
          }
        ],
      },
    ];
  },
  trailingSlash: true,
  reactStrictMode: false,
};

export default nextConfig;
