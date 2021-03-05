import { writeFile } from "fs/promises";
import { helloWorld, Project } from "../project";

const defaultCode = `print("${helloWorld}")`;

export async function python(project: Project) {
  await writeFile("main.py", defaultCode);
  await writeFile("requirements.txt", "");
}
