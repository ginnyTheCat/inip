import { writeFile } from "fs/promises";
import { Project, helloWorld } from "../project";

const defaultCode = `print("${helloWorld}")`;

export async function python(project: Project) {
  await writeFile("main.py", defaultCode);
  await writeFile("requirements.txt", "");
}
