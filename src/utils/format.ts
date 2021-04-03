import { format } from "prettier";

export function formatJson(o: any) {
  return format(JSON.stringify(o), { parser: "json" });
}

export function formatJs(code: string) {
  return format(code, { parser: "babel" });
}
