import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AbhyasMarg — From ambition to mastery",
  description: "An autonomous career-to-mastery learning agent."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}