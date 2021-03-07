import { settings } from "../settings";
import { exec } from "../utils/promise";

export async function npmInstall(dev: boolean, ...names: string[]) {
  if (names.length > 0) {
    const joinedNames = names.join(" ");

    const install = settings.npmInstaller === "yarn" ? "add" : "install";
    if (dev) {
      await exec(`${settings.npmInstaller} ${install} -D ${joinedNames}`);
    } else {
      await exec(`${settings.npmInstaller} ${install} ${joinedNames}`);
    }
  }
}
