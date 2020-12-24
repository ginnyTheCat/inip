import { exec } from "./utils/promise";

export function gitInit() {
  return exec("git init");
}
