/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: [
    'react-markdown',
    'remark-gfm',
    'remark-breaks',
    'rehype-raw',
    'rehype-sanitize',
    'micromark-core-commonmark',
    'micromark-factory-space',
    'micromark-util-character',
    'micromark-util-symbol',
    'micromark-util-types',
  ],
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
