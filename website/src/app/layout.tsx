import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StruXture - Digital Solutions",
  description: "StruXture Digital Solutions - Innovative technology and creative design.",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
