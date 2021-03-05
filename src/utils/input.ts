import { DistinctQuestion, prompt as inquirerPrompt } from "inquirer";

async function internalPrompt(data: DistinctQuestion) {
  data.name = "val";

  const { val } = await inquirerPrompt([data]);

  return val;
}

export function prompt(question: string, value?: string): Promise<string> {
  return internalPrompt({ message: question, default: value });
}

export function bool(
  question: string,
  value: boolean = true
): Promise<boolean> {
  return internalPrompt({
    type: "confirm",
    message: question,
    default: value,
  });
}

export async function choice(
  question: string,
  multiple: false,
  ...choices: string[]
): Promise<string>;
export async function choice(
  question: string,
  multiple: true,
  ...choices: string[]
): Promise<string[]>;
export async function choice(
  question: string,
  multiple: boolean,
  ...choices: string[]
): Promise<string | string[]> {
  return internalPrompt({
    type: multiple ? "checkbox" : "list",
    message: question,
    choices,
  });
}
