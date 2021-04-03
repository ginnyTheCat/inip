export interface PackageJson {
  name: string;
  version: string;
  description: string;
  main?: string;
  bin?: string;
  typings?: string;
  license?: string;
  scripts: Scripts;

  dependencies: Dependencies;
  devDependencies: Dependencies;

  repository?: {
    type: "git";
    url: string;
  };
  bugs?: {
    url: string;
  };
  homepage?: string;

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
  main: string | undefined
): PackageJson {
  return {
    name: name.toLowerCase(),
    version: "0.0.0",
    description: "",

    main,
    bin: undefined,
    typings: undefined,

    scripts: {},

    dependencies: {},
    devDependencies: {},
  };
}
