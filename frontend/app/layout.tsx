import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tugas infra",
  description:
    "Penugasan Git dan Version Control · Praktikum Rekayasa Sistem Informasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          background: "#f3f4f6",
        }}
      >
        {children}
      </body>
    </html>
  );
}