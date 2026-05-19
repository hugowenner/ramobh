import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * @react-pdf/renderer uses Node.js APIs (fs, canvas, etc.) and a custom
   * React reconciler. Exclude it from the server bundle so Next.js loads it
   * natively via require() at runtime instead of bundling it with webpack.
   */
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
