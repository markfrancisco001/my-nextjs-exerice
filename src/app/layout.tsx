import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../app/components/Header";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to Post Exercise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />

        <main className="flex flex-col justify-center items-center min-h-screen pb-24 bg-white">
          {children}
        </main>

        <Toaster />
      </body>
    </html>
  );
}