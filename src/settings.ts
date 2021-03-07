import { readFile, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import { stringify } from "./utils/json";

export const file = join(homedir(), ".inip.json");

type Hints = "github";

interface Settings {
  hints: Hints[];
  githubToken?: string;

  npmInstaller: "npm" | "pnpm" | "yarn";
}

const _default: Settings = {
  hints: ["github"],
  npmInstaller: "npm",
};

export var settings: Settings;

export function useHint(hint: Hints) {
  const i = settings.hints.indexOf(hint);
  if (i <= -1) return false;

  settings.hints.splice(i, 1);
  return true;
}

export async function load() {
  await writeFile(file, "{}", { flag: "wx" }).catch(() => {});

  const content = await readFile(file, "utf-8");
  settings = Object.assign({}, _default, JSON.parse(content));
}

export async function save() {
  if (file !== undefined) {
    writeFile(file, stringify(settings), "utf-8");
  }
}
