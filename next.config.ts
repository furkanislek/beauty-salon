import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: [
    "@floating-ui/dom",
    "@tiptap/react",
    "@tiptap/extension-floating-menu",
    "@tiptap/extension-bubble-menu",
  ],
};

export default nextConfig;
