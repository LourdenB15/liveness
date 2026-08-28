#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginDir = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
let targetDir = process.cwd();
let selectedAgents = [
  "claude",
  "cursor",
  "windsurf",
  "copilot",
  "antigravity",
  "generic",
];

for (const arg of args) {
  if (arg.startsWith("--agent=")) {
    const val = arg.split("=")[1].toLowerCase();
    if (val === "all") {
      selectedAgents = [
        "claude",
        "cursor",
        "windsurf",
        "copilot",
        "antigravity",
        "generic",
      ];
    } else {
      selectedAgents = val.split(",");
    }
  } else if (!arg.startsWith("--")) {
    targetDir = path.resolve(process.cwd(), arg);
  }
}

function copyFile(src, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log(`Installed: ${path.relative(targetDir, dest)}`);
}

function copyFolderRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  const files = fs.readdirSync(source);
  for (const file of files) {
    if (file === ".DS_Store") continue;
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursive(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

console.log(`Setting up Liveness SDK agent skills in: ${targetDir}`);

if (selectedAgents.includes("claude")) {
  const claudeSrc = path.join(pluginDir, "adapters/claude/CLAUDE.md");
  const claudeDest = path.join(targetDir, "CLAUDE.md");
  if (fs.existsSync(claudeSrc)) {
    copyFile(claudeSrc, claudeDest);
  }
}

if (selectedAgents.includes("cursor")) {
  const cursorMdcSrc = path.join(pluginDir, "adapters/cursor/liveness-sdk.mdc");
  const cursorMdcDest = path.join(targetDir, ".cursor/rules/liveness-sdk.mdc");
  const cursorRulesSrc = path.join(
    pluginDir,
    "adapters/cursor/liveness-sdk.mdc",
  );
  const cursorRulesDest = path.join(targetDir, ".cursorrules");
  if (fs.existsSync(cursorMdcSrc)) {
    copyFile(cursorMdcSrc, cursorMdcDest);
    copyFile(cursorRulesSrc, cursorRulesDest);
  }
}

if (selectedAgents.includes("windsurf")) {
  const windsurfSrc = path.join(pluginDir, "adapters/windsurf/.windsurfrules");
  const windsurfDest = path.join(targetDir, ".windsurfrules");
  if (fs.existsSync(windsurfSrc)) {
    copyFile(windsurfSrc, windsurfDest);
  }
}

if (selectedAgents.includes("copilot")) {
  const copilotSrc = path.join(
    pluginDir,
    "adapters/copilot/copilot-instructions.md",
  );
  const copilotDest = path.join(targetDir, ".github/copilot-instructions.md");
  if (fs.existsSync(copilotSrc)) {
    copyFile(copilotSrc, copilotDest);
  }
}

if (selectedAgents.includes("generic")) {
  const agentsSrc = path.join(pluginDir, "adapters/generic/AGENTS.md");
  const agentsDest = path.join(targetDir, "AGENTS.md");
  if (fs.existsSync(agentsSrc)) {
    copyFile(agentsSrc, agentsDest);
  }
}

if (selectedAgents.includes("antigravity")) {
  const agDest = path.join(targetDir, ".agents/plugins/liveness-sdk-plugin");
  copyFolderRecursive(pluginDir, agDest);
  console.log(
    `Installed Antigravity plugin: .agents/plugins/liveness-sdk-plugin`,
  );
}

console.log("Setup complete for selected agents.");
