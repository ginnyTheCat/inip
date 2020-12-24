export interface VSCLaunch {
  version: string;
  configurations: VSCLaunchConfig[];
}

export interface VSCLaunchConfig {
  name: string;
  type: string;
  request: "launch";
  cwd: string;
  runtimeExecutable: string;
  runtimeArgs: string[];
}
