/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.directus.io',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/cms/:path*',
        destination: `${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
