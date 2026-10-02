import type { Metadata, Viewport } from "next";
import "../globals.css";
import RootShell from "@/components/RootShell";
import { rootMetadata } from "@/lib/seo";

export const metadata: Metadata = rootMetadata("en");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F5F0",
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
