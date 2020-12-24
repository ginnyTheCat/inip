import { exec } from "../utils/promise";

export async function npmInstall(dev: boolean, ...names: string[]) {
  if (names.length > 0) {
    const joinedNames = names.join(" ");
    if (dev) {
      await exec(`npm install -D ${joinedNames}`);
    } else {
      await exec(`npm install ${joinedNames}`);
    }
  }
}
