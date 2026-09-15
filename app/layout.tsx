import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Srivisnu A Portfolio",
  description:
    "Srivisnu A Portfolio — software engineering, data analytics, data engineering, and machine learning.",
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
