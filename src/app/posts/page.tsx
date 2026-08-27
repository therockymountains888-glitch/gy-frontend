import { Suspense } from "react";
import { PostsPageClient } from "./PostsPageClient";
import { LoadingState } from "@/components/Status";

export default function PostsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PostsPageClient />
    </Suspense>
  );
}
