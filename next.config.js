const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @param {string} phase @returns {import('next').NextConfig} */
module.exports = (phase) => ({
  // Keep the preview server from locking production build files on Windows.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  // Windows symlinks require extra privileges; Docker builds run on Linux.
  output: process.platform === "win32" ? undefined : "standalone",
});
