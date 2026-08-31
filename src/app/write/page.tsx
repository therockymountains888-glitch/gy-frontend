import type { Metadata } from "next";
import { WritePageClient } from "./WritePageClient";

export const metadata: Metadata = {
  title: "写笔记",
};

export default function WritePage() {
  return <WritePageClient />;
}
