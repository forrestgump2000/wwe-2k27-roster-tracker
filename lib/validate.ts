export function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
}
