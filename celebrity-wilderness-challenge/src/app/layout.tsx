import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import dynamic from 'next/dynamic';


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
 title: "Celebrity Wilderness Challenge Simulator",
 description: "Generate hilarious survival scenarios for celebrities in bizarre environments",
};


const LaunchDarklyProvider = dynamic(() => import('../components/LaunchDarklyProvider'), { ssr: false });


export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
   <html lang="en">
     <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
       <LaunchDarklyProvider>
         {children}
       </LaunchDarklyProvider>
     </body>
   </html>
 );
}
