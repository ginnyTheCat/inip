import { mkdir, readFile, writeFile } from "fs/promises";
import { Language } from "../languages";
import { bool, choice } from "../utils/input";
import { stringifyBeatiful } from "../utils/json";
import { npmInstall } from "./npm";
import { createPackageJson, PackageJson } from "./package";
import { nodeTsConfig } from "./tsconfig";
import { helloWorld, Project } from "../project";

enum Libraries {
  AXIOS = "Axios",
  EXPRESS = "express",
  JEST = "Jest",
}

const defaultCode = `const main = async () => {
  console.log("${helloWorld}");
}

main().catch(console.error)
`;

const tsJest = `module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
};`;

export async function nodejs(project: Project) {
  await mkdir("src");

  const language = await choice(
    "Which language do you want to use?",
    false,
    Language.TYPESCRIPT,
    Language.JAVASCRIPT
  );

  const dist = language === Language.TYPESCRIPT ? "dist" : "src";
  const main = `${dist}/index.js`;

  const src =
    language === Language.TYPESCRIPT ? "src/index.ts" : "src/index.js";
  await writeFile(src, defaultCode);

  const pack = await createPackageJson(project.name, main, project.license);
  project.gitIgnore.push("node_modules");

  pack.scripts.start = `nodejs ${main}`;
  if (language === Language.TYPESCRIPT) {
    pack.scripts.build = "tsc";
    pack.scripts.prepare = "npm run build";
    pack.scripts.dev = `ts-node-dev --respawn ${src}`;
    pack.scripts.watch = `ts-node ${src}`;

    const tsConfig = Object.assign({}, nodeTsConfig);

    const declarations = await bool(
      "Should TypeScript emit declaration files? (usefull if you're building a library)",
      false
    );
    if (declarations) {
      tsConfig.compilerOptions!.declaration = true;
      pack.typings = "dist/index.d.ts";
    }

    await writeFile("tsconfig.json", stringifyBeatiful(tsConfig));
    await writeFile(".npmignore", "src\ntsconfig.json");

    project.gitIgnore.push("dist");
  } else {
    pack.scripts.dev = pack.scripts.start;
    pack.scripts.watch = `nodemon ${main}`;
  }

  await writeFile("package.json", stringifyBeatiful(pack));

  if (language === Language.TYPESCRIPT) {
    await npmInstall(
      true,
      "typescript",
      "@types/node",
      "ts-node",
      "ts-node-dev"
    );
  } else {
    await npmInstall(true, "nodemon");
  }

  const libs = await choice(
    "What libraries do you want to use?",
    true,
    ...Object.values(Libraries)
  );

  for (const l of libs) {
    switch (l) {
      case Libraries.AXIOS:
        await npmInstall(false, "axios");
        break;
      case Libraries.EXPRESS:
        await npmInstall(false, "express");
        if (language === Language.TYPESCRIPT) {
          await npmInstall(true, "@types/express");
        }
        break;
      case Libraries.JEST:
        const packageJson: PackageJson = JSON.parse(
          (await readFile("package.json")).toString()
        );
        if (language === Language.TYPESCRIPT) {
          await npmInstall(true, "jest", "@types/jest", "ts-jest");

          packageJson.jest = {
            preset: "ts-jest",
            testEnvironment: "node",
            modulePathIgnorePatterns: ["dist"],
          };
        } else {
          await npmInstall(true, "jest");
        }

        packageJson.scripts.test = "jest";
        await writeFile("package.json", stringifyBeatiful(packageJson));

        break;
    }
  }
}
