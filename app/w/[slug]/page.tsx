import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BY_SLUG, WRESTLERS } from "@/lib/wrestlers";
import { Profile } from "@/components/Profile";

export function generateStaticParams() {
  return WRESTLERS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const w = BY_SLUG[(await params).slug];
  if (!w) return {};
  const n = w.mainline.length + 1;
  return { title: w.name, description: `${w.name} in WWE 2K27 — ${n === 1 ? "series debut" : `mainline appearance #${n}`}, rating history, every WWE game, and community rating predictions.` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const w = BY_SLUG[(await params).slug];
  if (!w) notFound();
  return <Profile w={w} />;
}
