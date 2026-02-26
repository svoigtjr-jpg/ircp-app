import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IRCP | Internal Rhythm & Code Processing",
  description: "IRCP guided processing tool"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
