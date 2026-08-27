import { Suspense } from "react";
import { PostPageClient } from "./PostPageClient";
import { LoadingState } from "@/components/Status";

export default function PostPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PostPageClient />
    </Suspense>
  );
}
