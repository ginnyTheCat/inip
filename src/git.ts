import { exec } from "./utils/promise";

export function gitInit() {
  return exec("git init");
}

export function gitOrigin(url: string) {
  return exec(`git remote add origin ${url}`);
}
