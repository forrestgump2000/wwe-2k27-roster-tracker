import "server-only";
import { BY_SLUG } from "./wrestlers";
import { getCustom } from "./store";

/** True when the slug is a built-in or community-created superstar. */
export async function superstarExists(slug: string) {
  if (BY_SLUG[slug]) return true;
  return (await getCustom()).some((c) => c.slug === slug);
}
