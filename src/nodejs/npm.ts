import { exec } from "../utils/promise";

const cmd = "npm install --no-progress";

export async function npmInstall(dev: boolean, ...names: string[]) {
  if (names.length > 0) {
    const joinedNames = names.join(" ");
    if (dev) {
      await exec(`${cmd} -D ${joinedNames}`);
    } else {
      await exec(`${cmd} ${joinedNames}`);
    }
  }
}
