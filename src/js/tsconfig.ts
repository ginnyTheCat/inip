interface TsConfig {
  compilerOptions?: CompilerOptions;
  exclude?: string[];
  include?: string[];
}

type ESVersion = "es5" | "es6" | "es2017" | "es2018" | "es2020";
type Module = "commonjs";
type Lib = ESVersion | "dom";

interface CompilerOptions {
  target?: ESVersion;
  module?: Module;
  lib?: Lib[];
  jsx?: "react";

  outDir?: string;
  rootDir?: string;

  moduleResolution?: "node";
  removeComments?: boolean;
  downlevelIteration?: boolean;
  declaration?: boolean;

  strict?: boolean;
  strictNullChecks?: boolean;
  strictFunctionTypes?: boolean;

  noImplicitAny?: boolean;
  noImplicitThis?: boolean;
  noImplicitReturns?: boolean;
  noFallthroughCasesInSwitch?: boolean;

  esModuleInterop?: boolean;

  experimentalDecorators?: boolean;
  emitDecoratorMetadata?: boolean;

  resolveJsonModule?: boolean;
}

export const baseTsConfig: TsConfig = {
  compilerOptions: {
    target: undefined,
    module: "commonjs",
    lib: undefined,
    jsx: undefined,

    outDir: "dist",
    rootDir: "src",

    moduleResolution: undefined,
    removeComments: true,
    downlevelIteration: true,

    strict: true,
    strictNullChecks: true,
    strictFunctionTypes: true,

    noImplicitAny: true,
    noImplicitThis: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,

    esModuleInterop: true,

    experimentalDecorators: true,
    emitDecoratorMetadata: true,

    resolveJsonModule: true,
  },
};

export const nodeTsConfig: TsConfig = {
  ...baseTsConfig,
  compilerOptions: {
    ...baseTsConfig.compilerOptions,
    target: "es6",
    lib: ["es2018"],
    moduleResolution: "node",
  },
};

export const reactTsConfig: TsConfig = {
  ...baseTsConfig,
  compilerOptions: {
    ...baseTsConfig.compilerOptions,
    target: "es5",
    lib: ["es6", "dom"],
    jsx: "react",
  },
};
