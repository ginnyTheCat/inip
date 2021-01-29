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
  PUPPETEER = "Puppeteer",
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
    pack.scripts.dev = `ts-node ${src}`;
    pack.scripts.watch = `ts-node-dev --respawn ${src}`;

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

  const libs = await choice(
    "What libraries do you want to use?",
    true,
    ...Object.values(Libraries)
  );

  const dep: string[] = [];
  const devDep: string[] = [];
  if (language === Language.TYPESCRIPT) {
    devDep.push("typescript", "@types/node", "ts-node", "ts-node-dev");
  } else {
    devDep.push("nodemon");
  }

  for (const l of libs) {
    switch (l) {
      case Libraries.AXIOS:
        dep.push("axios");
        break;
      case Libraries.EXPRESS:
        dep.push("express");
        if (language === Language.TYPESCRIPT) {
          devDep.push("@types/express");
        }
        break;
      case Libraries.PUPPETEER:
        dep.push("puppeteer");
        if (language === Language.TYPESCRIPT) {
          devDep.push("@types/puppeteer");
        }
        break;
      case Libraries.JEST:
        devDep.push("jest");
        if (language === Language.TYPESCRIPT) {
          devDep.push("@types/jest", "ts-jest");

          pack.jest = {
            preset: "ts-jest",
            testEnvironment: "node",
            modulePathIgnorePatterns: ["dist"],
          };
        }

        pack.scripts.test = "jest";
        break;
    }
  }

  await writeFile("package.json", stringifyBeatiful(pack));

  npmInstall(false, ...dep);
  npmInstall(true, ...devDep);
}
