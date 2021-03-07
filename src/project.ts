import { Task } from "./utils/tasks";

export interface Project {
  name: string;
  license?: string;

  homepage?: string;
  bugs?: string;

  gitUrl?: string;
  gitIgnore: string[];

  tasks: Task[];
}

export const helloWorld = "Hello world";

export const licenses: Map<string, string> = new Map([
  ["MIT License", "MIT"],
  ["Apache License 2.0", "Apache-2.0"],
  ["GNU General Public License v3.0 only", "GPL-3.0-only"],
]);
