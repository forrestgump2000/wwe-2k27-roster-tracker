import type { Metadata } from "next";
import { BY_SLUG, WRESTLERS } from "@/lib/wrestlers";
import { Profile } from "@/components/Profile";
import { CustomProfile } from "@/components/CustomProfile";

export function generateStaticParams() {
  return WRESTLERS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const w = BY_SLUG[(await params).slug];
  if (!w) return { title: "Superstar" };
  const n = w.mainline.length + 1;
  return { title: w.name, description: `${w.name} in WWE 2K27 — ${n === 1 ? "series debut" : `mainline appearance #${n}`}, rating history, every WWE game, and community rating predictions.` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = BY_SLUG[slug];
  // community-created superstars aren't in the built-in database; load them client-side
  if (!w) return <CustomProfile slug={slug} />;
  return <Profile w={w} />;
}
