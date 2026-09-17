import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRollupPackage() {
  const { platform, arch } = process;

  if (platform === "win32") {
    if (arch === "arm64") return "@rollup/rollup-win32-arm64-msvc";
    if (arch === "ia32") return "@rollup/rollup-win32-ia32-msvc";
    return "@rollup/rollup-win32-x64-msvc";
  }

  if (platform === "darwin") {
    if (arch === "arm64") return "@rollup/rollup-darwin-arm64";
    return "@rollup/rollup-darwin-x64";
  }

  if (platform === "linux") {
    const isMusl = () => {
      try {
        return !process.report?.getReport()?.header?.glibcVersionRuntime;
      } catch {
        return false;
      }
    };

    if (arch === "arm64") {
      return isMusl()
        ? "@rollup/rollup-linux-arm64-musl"
        : "@rollup/rollup-linux-arm64-gnu";
    }
    if (arch === "arm") {
      return isMusl()
        ? "@rollup/rollup-linux-arm-musleabihf"
        : "@rollup/rollup-linux-arm-gnueabihf";
    }
    if (arch === "x64") {
      return isMusl()
        ? "@rollup/rollup-linux-x64-musl"
        : "@rollup/rollup-linux-x64-gnu";
    }
  }

  return null;
}

// Prevent infinite postinstall loop when npm install is invoked inside postinstall
if (
  process.env.POSTINSTALL_WIN_ROLLUP_RUNNING ||
  process.env.POSTINSTALL_ROLLUP_RUNNING
) {
  process.exit(0);
}

const targetPkg = getRollupPackage();

if (targetPkg) {
  const rollupPackagePath = path.resolve(
    __dirname,
    `../node_modules/${targetPkg}`,
  );

  if (fs.existsSync(rollupPackagePath)) {
    console.log(`${targetPkg} is already installed.`);
  } else {
    console.log(
      `Platform ${process.platform} (${process.arch}) detected. Installing ${targetPkg}...`,
    );
    try {
      execSync(`npm install ${targetPkg} --no-save --no-audit --no-fund`, {
        stdio: "inherit",
        env: {
          ...process.env,
          POSTINSTALL_WIN_ROLLUP_RUNNING: "true",
          POSTINSTALL_ROLLUP_RUNNING: "true",
        },
      });
      console.log(`Successfully installed ${targetPkg}.`);
    } catch (error) {
      console.error(`Failed to install ${targetPkg}:`, error.message);
      // Try with --save-dev fallback
      try {
        execSync(`npm install ${targetPkg} --save-dev --no-audit --no-fund`, {
          stdio: "inherit",
          env: {
            ...process.env,
            POSTINSTALL_WIN_ROLLUP_RUNNING: "true",
            POSTINSTALL_ROLLUP_RUNNING: "true",
          },
        });
        console.log(`Successfully installed ${targetPkg} with --save-dev.`);
      } catch (fallbackError) {
        console.error(
          `Fallback installation also failed:`,
          fallbackError.message,
        );
        process.exit(1);
      }
    }
  }
} else {
  console.log(
    `Platform ${process.platform} (${process.arch}) does not require a known native Rollup binary or is unsupported.`,
  );
}
