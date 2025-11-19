import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StruXture - Digital Solutions",
  description: "StruXture Digital Solutions - Innovative technology and creative design.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/gei1cex.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
