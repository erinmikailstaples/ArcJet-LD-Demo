import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Celebrity Wilderness Challenge",
  description: "AI-powered celebrity survival scenarios",
};

const LDProvider = await asyncWithLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID!,
  options: {
    bootstrap: "localStorage",
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <LDProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </LDProvider>
    </html>
  );
}
