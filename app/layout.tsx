import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Srivisnu A — Data Engineering & Machine Learning",
  description:
    "Portfolio of Srivisnu A — Data Engineer and Machine Learning Engineer based in Chennai. Computer vision, deep learning, and data pipelines.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0A0B10] text-[#E7E9EE]">
        {children}
      </body>
    </html>
  );
}
