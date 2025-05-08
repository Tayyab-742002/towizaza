import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Towizaza | Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <main className="flex-grow pt-16 sm:pt-20">{children}</main>
      </body>
    </html>
  );
}
