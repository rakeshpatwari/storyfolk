#!/usr/bin/env node

import { copyFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = join(process.cwd(), "dist", "client");
const assetsDir = join(outputDir, "assets");
const indexPath = join(outputDir, "index.html");

const styles = readdirSync(assetsDir).filter((name) => /^styles-[\w-]+\.css$/.test(name));
if (styles.length !== 1) {
  throw new Error(`Expected one generated stylesheet, found: ${styles.join(", ") || "none"}`);
}

let html = readFileSync(indexPath, "utf8");
html = html.replace(/styles-[\w-]+\.css/g, styles[0]);
writeFileSync(indexPath, html);
copyFileSync(indexPath, join(outputDir, "404.html"));
writeFileSync(join(outputDir, ".nojekyll"), "");

console.log(`[pages] Prepared static output in ${outputDir}`);
