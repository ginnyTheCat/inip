import { writeFile } from "fs/promises";
import { yellow } from "kleur";
import { Language } from "../languages";
import { helloWorld, Project } from "../project";
import { formatJson } from "../utils/format";
import { bool } from "../utils/input";
import { PackageJson } from "./package";
import { nodeTsConfig } from "./tsconfig";

const defaultCode = `const main = async () => {
  console.log("${helloWorld}");
}

main().catch(console.error)
`;

const cliHeader = "#!/usr/bin/env node\n\n";

export async function nodejs(
  project: Project,
  pack: PackageJson,
  language: Language
) {
  const src =
    language === Language.TYPESCRIPT ? "src/index.ts" : "src/index.js";

  pack.scripts.start = `nodejs ${pack.main}`;
  if (language === Language.TYPESCRIPT) {
    pack.scripts.build = "tsc";
    pack.scripts.prepare = "npm run build";
    pack.scripts.dev = `ts-node ${src}`;
    pack.scripts.watch = `ts-node-dev --respawn ${src}`;

    const tsConfig = Object.assign({}, nodeTsConfig);

    const lib = await bool(`Are you building a ${yellow("library")}?`, false);
    if (lib) {
      tsConfig.compilerOptions!.declaration = true;
      pack.typings = "dist/index.d.ts";
    }

    await writeFile("tsconfig.json", formatJson(tsConfig));
    await writeFile(".npmignore", "src\ntsconfig.json");

    project.gitIgnore.push("dist");
  } else {
    pack.scripts.dev = pack.scripts.start;
    pack.scripts.watch = `nodemon ${pack.main}`;
  }

  const cli = await bool(`Are you building a ${yellow("CLI tool")}?`, false);
  if (cli) {
    pack.bin = pack.main;
    await writeFile(src, cliHeader + +defaultCode);
  } else {
    await writeFile(src, defaultCode);
  }

  if (language === Language.TYPESCRIPT) {
    return ["typescript", "@types/node", "ts-node", "ts-node-dev"];
  } else {
    return ["nodemon"];
  }
}
