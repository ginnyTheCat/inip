import prompts from "prompts";

async function internalPrompt(data: Omit<prompts.PromptObject, "name">) {
  const { val } = await prompts({
    name: "val",
    ...data,
  });

  if (val === undefined) {
    process.exit(0);
  }
  return val;
}

export function prompt(question: string, value?: string): Promise<string> {
  return internalPrompt({
    type: "text",
    message: question,
    initial: value,
  });
}

export function bool(
  question: string,
  value: boolean = true
): Promise<boolean> {
  return internalPrompt({
    type: "confirm",
    message: question,
    initial: value,
  });
}

export function choice<T extends string>(
  question: string,
  multiple: false,
  ...choices: T[]
): Promise<T>;
export function choice<T extends string>(
  question: string,
  multiple: true,
  ...choices: T[]
): Promise<T[]>;
export function choice<T extends string>(
  question: string,
  multiple: boolean,
  ...choices: T[]
): Promise<T | T[]> {
  return internalPrompt({
    type: multiple ? "multiselect" : "select",
    message: question,
    choices: choices.map((c) => {
      return { title: c, value: c };
    }),
    hint: "",
    instructions: "",
  });
}
