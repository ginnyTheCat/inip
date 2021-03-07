#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "fs/promises";
import { bold, cyan, green, magenta, yellow } from "kleur";
import { resolve } from "path";
import { gitInit, gitOrigin } from "./git";
import { createGitHubRepo } from "./github";
import { nodejs } from "./nodejs/index";
import { licenses, Project } from "./project";
import { python } from "./python";
import { load, save, settings, useHint } from "./settings";
import { bool, choice, prompt } from "./utils/input";

enum Technologies {
  NODEJS = "Node.js",
  PYTHON = "Python",
}

async function main() {
  await load();

  console.log(
    `\n${bold(
      `Time to built something ${magenta("great")}!`
    )}\nLets's get started setting up your project.\n`
  );

  const name = await prompt(`What do you want to ${yellow("name")} it?`);
  await mkdir(name);
  process.chdir(name);

  var homepage: string | undefined;
  var bugs: string | undefined;
  var gitUrl: string | undefined;

  const git = await bool(
    `Would you like to initialize a ${yellow("git repo")}?`
  );
  if (git) {
    await gitInit();

    const github = await bool(
      `Do you want to create a ${yellow("GitHub repo")}?`,
      false
    );
    if (github) {
      if (settings.githubToken === undefined) {
        console.log(
          `\nTo be able to create a GitHub repo we need your ${yellow(
            "personal access token"
          )}.\nThe tokens has to have access to the ${green().bold(
            "repo scope"
          )}.\nYou'll only have to input it once. ${yellow(
            "We'll save it for you."
          )}\nCreate a new token on ${cyan(
            "https://github.com/settings/tokens"
          )}.\n`
        );

        settings.githubToken = await prompt("Your personal access token:");
      }

      if (useHint("github")) {
        console.log(
          `\nChoose a ${yellow(
            "repo name"
          )}.\n\nFor personal repos, input ${yellow(
            "name"
          )}.\nFor organisation repos, input ${green("org")}/${yellow(
            "name"
          )}.\n`
        );
      }

      const repo = await prompt("repo name", name);
      const _private = await bool("private?", true);

      const url = await createGitHubRepo(repo, _private, settings.githubToken);

      homepage = url + "#readme";
      bugs = url + "/issues";
      gitUrl = url + ".git";
    }

    if (gitUrl !== undefined) {
      await gitOrigin(gitUrl);
    }
  }

  const licenseName = await choice(
    "Which license do you want to use?",
    false,
    "None",
    ...licenses.keys()
  );
  const license = licenses.get(licenseName);

  if (license !== undefined) {
    const fileName = resolve(__dirname, `../licenses/${license}.txt`);
    var licenseContent = (await readFile(fileName)).toString();

    const year = new Date().getFullYear().toString();
    licenseContent = licenseContent.replace("{year}", year);

    if (licenseContent.includes("{holder}")) {
      const name = await prompt("Who is the copyright holder?");
      licenseContent = licenseContent.replace("{holder}", name);
    }

    await writeFile("LICENSE", licenseContent);
  }

  const project: Project = {
    name,
    license,

    homepage,
    bugs,

    gitIgnore: [],
    gitUrl,
  };

  const tool = await choice(
    "Choose a technology",
    false,
    ...Object.values(Technologies)
  );
  switch (tool) {
    case Technologies.NODEJS:
      await nodejs(project);
      break;
    case Technologies.PYTHON:
      await python(project);
      break;
  }

  await writeFile(".gitignore", project.gitIgnore.join("\n"));

  await save();

  console.log(`\n${magenta().bold("Finished!")}\n`);
}

main();
