import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainProvider from "./contexts/MainProvider";
import Navbar from "./common/components/Navbar";
import SideBar from "./common/components/Side-bar";
import "highlight.js/styles/github.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TalkUs - Chat",
  icons: {
    icon: "./common/icons/icon.ico",
  },
  keywords: ["TalkUs", "Chat", "post", "blog", "group", "groups"],
  description:
    "TalkUs is a application that allows you to create groups and communicate with other persons around de world about many topics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}` + ""}>
        <MainProvider>
          <Navbar />
          <div className="grid xl:grid-cols-6">
            <div className="xl:col-span-1 hidden xl:block overflow-y-auto scrollbar-hide">
              <SideBar />
            </div>
            <div className="self-start col-span-5">
              {children}
            </div>

          </div>
        </MainProvider>
      </body>
    </html>
  );
}
