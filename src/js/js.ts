import { mkdir, writeFile } from "fs/promises";
import { yellow } from "kleur";
import { Language } from "../languages";
import { helloWorld, Project } from "../project";
import { formatJson } from "../utils/format";
import { choice } from "../utils/input";
import { generateWebpackConfig, WebpackRule } from "./bundler/webpack";
import { PackageJson } from "./package";
import { reactTsConfig } from "./tsconfig";

enum Framework {
  REACT = "React",
  VUE = "Vue.js",
  SVELTE = "Svelte",
}

const reactTs = `import React from "react";
import ReactDOM from "react-dom";

function App() {
  return <h1>${helloWorld}</h1>
}

ReactDOM.render(<App />, document.getElementById("root"));
`;

enum Bundlers {
  WEBPACK = "Webpack",
  ROLLUP = "Rollup",
  SNOWPACK = "Snowpack",
}

export async function bundledJs(
  project: Project,
  pack: PackageJson,
  language: Language
) {
  await mkdir("public");
  await writeFile("public/index.html", html(project.name));

  const framework = await choice(
    `Which ${yellow("framework")} do you want to use?`,
    false,
    ...Object.values(Framework)
  );

  const dep: string[] = [];
  const devDep: string[] = [];

  var main: string;
  var extension: string;
  var extensions: Set<string> = new Set(["js"]);

  switch (framework) {
    case Framework.REACT:
      extension = language === Language.TYPESCRIPT ? "tsx" : "jsx";
      extensions.add(extension);

      main = `src/index.${extension}`;

      dep.push("react", "react-dom");
      devDep.push("@types/react", "@types/react-dom");

      if (language === Language.TYPESCRIPT) {
        extensions.add("ts");

        await writeFile(main, reactTs);

        await writeFile("tsconfig.json", formatJson(reactTsConfig));
      } else {
      }
      break;
    case Framework.VUE:
      throw "Not implemented";
      break;
    case Framework.SVELTE:
      throw "Not implemented";
      break;
  }

  const bundler = await choice(
    `Which ${yellow("bundler")} do you want to use?`,
    false,
    ...Object.values(Bundlers)
  );

  switch (bundler) {
    case Bundlers.WEBPACK:
      pack.scripts.build = "webpack --mode=production";
      pack.scripts.dev = "webpack serve --mode=development --open";

      devDep.push("webpack", "webpack-cli", "webpack-dev-server");

      const transpiler =
        language === Language.TYPESCRIPT ? "ts-loader" : "babel-loader";
      devDep.push(transpiler);

      const rules: WebpackRule[] = [];

      rules.push({
        test: `/.${extension}${Framework.REACT ? "?" : ""}\$/`,
        use: transpiler,
      });

      writeFile(
        "webpack.config.js",
        generateWebpackConfig({
          entry: `./${main}`,
          output: {
            filename: "bundle.js",
            path: "dist",
          },
          resolve: {
            extensions: Array.from(extensions).map((e) => "." + e),
          },
          rules,
        })
      );

      break;
    case Bundlers.ROLLUP:
      throw "Not implemented";
      break;
    case Bundlers.SNOWPACK:
      throw "Not implemented";
      break;
  }

  return [dep, devDep];
}

function html(name: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="bundle.js"></script>
  </body>
</html>
`;
}
