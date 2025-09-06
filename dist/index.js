import {
  renderDir
} from "./chunk-KXHTPMBT.js";

// src/index.ts
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import prompts from "prompts";
import { execa } from "execa";
import { cyan, green, red, yellow } from "kolorist";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var TPL_DIR = path.resolve(__dirname, "../templates/default");
function detectPM() {
  const ua = process.env.npm_config_user_agent || "";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  return "npm";
}
async function main() {
  const argTarget = process.argv[2];
  const res = await prompts(
    [
      {
        type: argTarget ? null : "text",
        name: "target",
        message: "Project name?",
        initial: "my-app"
      },
      {
        type: "text",
        name: "packageName",
        message: "Package name?",
        initial: (prev, values) => (argTarget || values.target || "my-app").toString().trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-")
      },
      {
        type: "toggle",
        name: "useTailwind",
        message: "Include TailwindCSS?",
        initial: true,
        active: "yes",
        inactive: "no"
      },
      {
        type: "text",
        name: "locales",
        message: "i18n locales (comma separated)",
        initial: "vi,en"
      }
    ],
    { onCancel: () => process.exit(1) }
  );
  const ctx = {
    target: argTarget || res.target,
    packageName: res.packageName,
    useTailwind: !!res.useTailwind,
    locales: String(res.locales || "vi,en").split(",").map((s) => s.trim()).filter(Boolean)
  };
  const dest = path.resolve(process.cwd(), ctx.target);
  if (fs.existsSync(dest) && fs.readdirSync(dest).length) {
    console.log(red(`Directory '${ctx.target}' is not empty.`));
    process.exit(1);
  }
  await fs.mkdirp(dest);
  await renderDir(TPL_DIR, dest, ctx);
  try {
    const gi = path.join(dest, "gitignore");
    const dotGi = path.join(dest, ".gitignore");
    if (await fs.pathExists(gi) && !await fs.pathExists(dotGi)) {
      await fs.move(gi, dotGi);
    }
  } catch {
  }
  if (!ctx.useTailwind) {
    for (const f of ["tailwind.config.ts", "postcss.config.js"]) {
      const p = path.join(dest, f);
      if (await fs.pathExists(p)) await fs.remove(p);
    }
  }
  try {
    await execa("git", ["init"], { cwd: dest, stdio: "inherit" });
  } catch {
  }
  const pm = detectPM();
  console.log(yellow(`Installing dependencies with ${pm}\u2026`));
  await execa(pm, ["install"], { cwd: dest, stdio: "inherit" });
  try {
    await execa("git", ["add", "-A"], { cwd: dest });
    await execa(
      "git",
      ["commit", "-m", "chore: scaffold from create-bee-next-app"],
      { cwd: dest }
    );
  } catch {
  }
  console.log(green(`
\u2714 Project ready: ${cyan(ctx.target)}
`));
  console.log(`Run dev:
  cd ${ctx.target}
  ${pm} run dev
`);
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
