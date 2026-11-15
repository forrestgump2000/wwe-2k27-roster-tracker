import type { Metadata } from "next";
import { Superstars } from "@/components/Superstars";
export const metadata: Metadata = {
  title: "Superstars",
  description: "Browse every WWE superstar and legend in the database — game history, appearance numbers and who’s already confirmed for WWE 2K27.",
};
export default function Page() {
  return <Superstars />;
}
