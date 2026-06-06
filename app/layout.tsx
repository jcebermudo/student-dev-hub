import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SidebarLayout } from "@/components/sidebar-layout";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "StudentDevHub",
  description: "A hub for student developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", spaceGrotesk.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
