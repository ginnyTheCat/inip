#!/usr/bin/env node
import { gitInit } from "./git";
import { bool, choice, prompt } from "./utils/input";
import { mkdir, readFile, writeFile } from "fs/promises";
import { nodejs } from "./nodejs/index";
import { licenses, Project } from "./project";
import { join, resolve } from "path";
import { python } from "./python";
import { VSCLaunch } from "./vscode";
import { stringifyBeatiful } from "./utils/json";

enum Technologies {
  NODEJS = "Node.js",
  PYTHON = "Python",
}

async function main() {
  const name = await prompt("Choose a name for your project:");
  await mkdir(name);
  process.chdir(name);

  const git = await bool("Would you like to initialize a git repository?");
  if (git) {
    await gitInit();
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
    gitIgnore: [],
    vsCodeLaunches: [],
  };

  const tool = await choice(
    "Choose a technology:",
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

  if (project.vsCodeLaunches.length > 0) {
    const launchJson: VSCLaunch = {
      version: "0.2.0",
      configurations: project.vsCodeLaunches,
    };

    await mkdir(".vscode");
    await writeFile(".vscode/launch.json", stringifyBeatiful(launchJson));
  }
}

main();
