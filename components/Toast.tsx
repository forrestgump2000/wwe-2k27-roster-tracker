"use client";
import { useEffect } from "react";
export function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [msg, onDone]);
  return <div className="toast" role="status">{msg}</div>;
}
