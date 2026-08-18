/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // `unoptimized: true` used to be set here, which disabled srcset generation
    // entirely — every `sizes` prop in the app was inert and local images shipped
    // at full resolution regardless of the slot they render into.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    // Default ladder jumps 1200 -> 1920, so a 2x-DPR card (needs ~1368) pulled a
    // 1920 candidate: ~40% more pixels than the slot. The 1440 rung closes that gap.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    loaderFile: "./lib/image-loader.js",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
}

export default nextConfig
