import { Suspense } from "react";
import { FrontDeskSearch } from "@/components/frontdesk/FrontDeskSearch";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search visitor" };

export default function FrontDeskSearchPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading search…</p>}>
      <FrontDeskSearch />
    </Suspense>
  );
}
