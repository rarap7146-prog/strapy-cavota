/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "cavota.id"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cavota.id",
        pathname: "/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/id",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
