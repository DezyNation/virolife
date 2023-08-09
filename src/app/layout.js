"use client";
import Footer from "@/components/global/Footer";
import Navbar from "@/components/global/Navbar";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import "../app/styles/globals.css";

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({ children, session }) {
  return (
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Virolife</title>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2480119685720701"
          crossorigin="anonymous"
        ></script>
      </head>
      <body>
        <ChakraProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
