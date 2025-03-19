
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simba Super Market",
  description: "Resume Ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="inset-0">
      {children}
    </div>
  );
}
