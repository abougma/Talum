import type { ReactNode } from "react";
import { PageAnimations } from "@/components/page-animations";

export default function LocaleTemplate({ children }: { children: ReactNode }) {
  return <PageAnimations>{children}</PageAnimations>;
}
