export interface PackageJson {
  name: string;
  version: string;
  description: string;
  main: string;
  typings?: string;
  license?: string;
  scripts: Scripts;
  dependencies: Dependencies;
  devDependencies: Dependencies;

  [key: string]: any;
}

interface Scripts {
  [name: string]: string;
}

interface Dependencies {
  [name: string]: string;
}

export function createPackageJson(
  name: string,
  main: string,
  license?: string
): PackageJson {
  return {
    name: name.toLowerCase(),
    version: "1.0.0",
    description: "",
    license,
    main,
    scripts: {},
    dependencies: {},
    devDependencies: {},
  };
}
