import type { Metadata } from "next";
import { Amiri } from "next/font/google";
import "./globals.css";
import LeftSidebar from "@/components/LeftSidebar";
import Navbar from "@/components/Navbar";

const amiri = Amiri({
  weight: "400",
  variable: "--font-amiri",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Quran Web App",
  description: "Quran Web App is a simple web application that allows you to read the Quran online. It is built with Next.js and Tailwind CSS.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${amiri.variable} antialiased`}>
      <body>
        <div className="flex h-screen">
          <LeftSidebar />
          <div className="flex-1">
            <Navbar />
            <div className="w-full">
              <main>{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
