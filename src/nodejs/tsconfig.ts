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

export const nodeTsConfig: TsConfig = {
  compilerOptions: {
    target: "es6",
    module: "commonjs",
    lib: ["es6"],

    outDir: "dist",
    rootDir: "src",

    moduleResolution: "node",
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
