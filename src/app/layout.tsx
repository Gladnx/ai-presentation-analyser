import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Presentation Analyser",
  description:
    "Paste your presentation script and get an AI powered score, mood analysis, improvement tips, and predicted audience questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem("theme");
                if (theme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
