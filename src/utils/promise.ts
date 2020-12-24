import { exec as callbackExec } from "child_process";

export function exec(command: string) {
  return new Promise<string>((resolve, reject) =>
    callbackExec(command, (err, data) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  );
}
