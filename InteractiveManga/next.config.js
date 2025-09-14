/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  reactStrictMode: true,
  // Ensure Next uses this project directory as the tracing root
  outputFileTracingRoot: path.resolve(__dirname),
};

module.exports = nextConfig;
