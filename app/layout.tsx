import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar, MobileSidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getFinancialStats } from "@/app/actions/stats";
import { SettingsProvider } from "@/components/settings-provider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Personal and Business Finance Tracking",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stats = await getFinancialStats()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="h-full relative group/layout">
            <div className="hidden h-full md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 group-has-[.login-page-hide]/layout:hidden">
              <Sidebar stats={stats} />
            </div>
            <main className="md:pl-60 h-full group-has-[.login-page-hide]/layout:md:pl-0">
              <div className="flex items-center p-4 md:hidden border-b mb-4 group-has-[.login-page-hide]/layout:hidden">
                <MobileSidebar stats={stats} />
              </div>
              {children}
            </main>
          </div>
          <Toaster />
          <SettingsProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
