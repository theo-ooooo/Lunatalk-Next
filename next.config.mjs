/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media-v2.lunatalk.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'dev-api.lunatalk.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'admin.lunatalk.co.kr',
      },
    ],
  },
};

export default nextConfig;
