"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const p = usePathname();
  const onSuperstars = p.startsWith("/superstars");
  return (
    <nav className="nav" aria-label="Main">
      <Link href="/" className={!onSuperstars ? "on" : ""}>2K27 Roster</Link>
      <Link href="/superstars" className={onSuperstars ? "on" : ""}>Superstars</Link>
    </nav>
  );
}
