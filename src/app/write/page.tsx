import type { Metadata } from "next";
import { Suspense } from "react";
import { WritePageClient } from "./WritePageClient";
import { LoadingState } from "@/components/Status";

export const metadata: Metadata = {
  title: "写笔记",
};

export default function WritePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <WritePageClient />
    </Suspense>
  );
}
