import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://night-sky-birthday-surprise.shk-saad295.chatgpt.site"),
  title: "A Night Written in Stars",
  description: "A cinematic night-sky birthday surprise, written in moonlight and stars.",
  openGraph: {
    title: "A Night Written in Stars",
    description: "Tonight, the stars have something special to say…",
    type: "website",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "A Night Written in Stars under a luminous moon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "A Night Written in Stars",
    description: "Tonight, the stars have something special to say…",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
