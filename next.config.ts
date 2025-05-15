/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["ram-evaluation-interface.s3.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ram-evaluation-interface.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
