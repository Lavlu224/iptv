import type { NextConfig } from "next";

const customOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((item) => item.trim())
  : [];

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: customOrigins,
};

export default nextConfig;
