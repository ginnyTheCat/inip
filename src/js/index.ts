import { mkdir, writeFile } from "fs/promises";
import { yellow } from "kleur";
import { Language } from "../languages";
import { Project } from "../project";
import { settings } from "../settings";
import { formatJson } from "../utils/format";
import { choice } from "../utils/input";
import { bundledJs } from "./js";
import { nodejs } from "./node";
import { npmInstall } from "./npm";
import { createPackageJson } from "./package";

enum Libraries {
  AXIOS = "Axios",
  EXPRESS = "express",
  PUPPETEER = "Puppeteer",
  JEST = "Jest",
}

export async function js(project: Project, node: boolean) {
  await mkdir("src");

  const language = await choice(
    `Which ${yellow("language")} do you want to use?`,
    false,
    Language.TYPESCRIPT,
    Language.JAVASCRIPT
  );

  const dist = language === Language.TYPESCRIPT ? "dist" : "src";

  const pack = await createPackageJson(
    project.name,
    node ? `${dist}/index.js` : undefined
  );

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

  var dep: string[];
  var devDep: string[];

  if (node) {
    dep = [];
    devDep = await nodejs(project, pack, language);
  } else {
    [dep, devDep] = await bundledJs(project, pack, language);
  }

  const libs = await choice(
    `Which ${yellow("libraries")} do you want to use?`,
    true,
    ...Object.values(Libraries)
  );

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

  await writeFile("package.json", formatJson(pack));

  project.tasks.push({
    title: `Installing ${yellow(dep.length)} dependencies`,
    description: settings.npmInstaller,
    task: () => npmInstall(false, ...dep),
  });

  project.tasks.push({
    title: `Installing ${yellow(devDep.length)} dev dependencies`,
    description: settings.npmInstaller,
    task: () => npmInstall(true, ...devDep),
  });
}
