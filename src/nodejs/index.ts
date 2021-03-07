import { mkdir, writeFile } from "fs/promises";
import { Language } from "../languages";
import { helloWorld, Project } from "../project";
import { bool, choice } from "../utils/input";
import { stringify } from "../utils/json";
import { npmInstall } from "./npm";
import { createPackageJson } from "./package";
import { nodeTsConfig } from "./tsconfig";

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

const cliHeader = "#!/usr/bin/env node\n\n";

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

  const pack = await createPackageJson(project.name, main);

  pack.license = project.license;
  pack.homepage = project.homepage;

  if (project.bugs !== undefined) {
    pack.bugs = { url: project.bugs };
  }

  if (project.gitUrl !== undefined) {
    pack.repository = {
      type: "git",
      url: project.gitUrl,
    };
  }

  project.gitIgnore.push("node_modules");

  pack.scripts.start = `nodejs ${main}`;
  if (language === Language.TYPESCRIPT) {
    pack.scripts.build = "tsc";
    pack.scripts.prepare = "npm run build";
    pack.scripts.dev = `ts-node ${src}`;
    pack.scripts.watch = `ts-node-dev --respawn ${src}`;

    const tsConfig = Object.assign({}, nodeTsConfig);

    const lib = await bool("Are you building a library?", false);
    if (lib) {
      tsConfig.compilerOptions!.declaration = true;
      pack.typings = "dist/index.d.ts";
    }

    await writeFile("tsconfig.json", stringify(tsConfig));
    await writeFile(".npmignore", "src\ntsconfig.json");

    project.gitIgnore.push("dist");
  } else {
    pack.scripts.dev = pack.scripts.start;
    pack.scripts.watch = `nodemon ${main}`;
  }

  const cli = await bool("Are you building a CLI tool?", false);
  if (cli) {
    pack.bin = main;
    await writeFile(src, cliHeader + +defaultCode);
  } else {
    await writeFile(src, defaultCode);
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

  await writeFile("package.json", stringify(pack));

  await npmInstall(false, ...dep);
  await npmInstall(true, ...devDep);
}
