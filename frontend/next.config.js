/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mui/material', '@mui/icons-material'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? '/api/:path*'  // In production, handled by ingress
          : 'http://backend:8000/api/:path*',  // In development/docker, proxy to backend
      },
    ];
  },
}

module.exports = nextConfig