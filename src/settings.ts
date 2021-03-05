import { readFile, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";

const file = join(homedir(), ".inip.json");

interface Settings {
  githubToken?: string;
}

const _default: Settings = {};

export var settings: Settings;

export async function load() {
  if (file === undefined) {
    settings = {};
  } else {
    await writeFile(file, JSON.stringify(_default), {
      flag: "wx",
    }).catch(() => {});

    const content = await readFile(file, "utf-8");
    settings = JSON.parse(content);
  }
}

export async function save() {
  if (file !== undefined) {
    writeFile(file, JSON.stringify(settings), "utf-8");
  }
}
