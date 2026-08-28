#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target directory from CLI argument, default to './public'
const targetDir = process.argv[2] || path.resolve(process.cwd(), "public");

// Search candidate locations for model assets
const candidateSourceDirs = [
  path.resolve(__dirname, "../../../../packages/engine/assets"),
  path.resolve(process.cwd(), "node_modules/@liveness/engine/assets"),
  path.resolve(process.cwd(), "packages/engine/assets"),
  path.resolve(__dirname, "../assets"),
];

let sourceDir = candidateSourceDirs.find((dir) => fs.existsSync(dir));

if (!sourceDir) {
  console.error(
    "Error: Could not locate Liveness model assets in node_modules or packages.",
  );
  console.error(
    "Please ensure @liveness/engine is installed or present in the workspace.",
  );
  process.exit(1);
}

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    if (file === ".DS_Store") continue;
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

console.log(`Copying Liveness assets...`);
console.log(`  Source: ${sourceDir}`);
console.log(`  Target: ${targetDir}`);

try {
  copyFolderRecursiveSync(sourceDir, targetDir);
  console.log(
    `Successfully copied face_mesh and mobilenet-v2 assets to: ${targetDir}`,
  );
} catch (err) {
  console.error(`Failed to copy assets: ${err.message}`);
  process.exit(1);
}
