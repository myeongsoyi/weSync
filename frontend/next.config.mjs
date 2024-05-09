/** @type {import('next').NextConfig} */
import path from "path";

//__dirname 선언
const __dirname = path.resolve();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wesync.co.kr",
      },
      {
        protocol: "http",
        hostname: "wesync.co.kr",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "styles/_variables.scss"; @import "styles/_mixins.scss";`,
  },
  output: "standalone",
};

export default nextConfig;
