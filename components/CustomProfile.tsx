"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useSummary } from "@/lib/client";
import { mergeWrestlers } from "@/lib/custom";
import { Profile } from "./Profile";

/** Profile page for a community-created superstar (looked up from the shared database). */
export function CustomProfile({ slug }: { slug: string }) {
  const { data, error } = useSummary(60000);
  const w = useMemo(() => mergeWrestlers(data?.custom).bySlug[slug], [data, slug]);
  if (w) return <Profile w={w} />;
  return (
    <div className="wrap">
      <Link href="/superstars" className="back">← All superstars</Link>
      <div className="empty">
        {!data && !error ? <h3>Loading…</h3> : <><h3>Superstar not found</h3><p>Nobody by that name is in the database yet.</p><Link className="btn btn-red" href="/superstars">Browse superstars</Link></>}
      </div>
    </div>
  );
}
