#!/usr/bin/env node

const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./getWebsocket.js"],
    bundle: true,
    format: "esm",
    outfile: "out.js",
    // sourcemap: true,
    // minify: true,
  })
  .catch(() => process.exit(1));
